import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import * as path from 'path';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('SecretSantaController (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue({
        post: jest.fn().mockReturnValue(
          of({
            data: {
              data: {
                message: 'Assignments created',
                filePath: '/output/secret_santa_result.csv',
              },
            },
          }),
        ),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    httpService = moduleFixture.get(HttpService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 400 when employeesFile is missing', async () => {
    const res = await request(app.getHttpServer())
      .post('/secret-santa/upload')
      .expect(HttpStatus.BAD_REQUEST);

    expect(res.body.message).toBe('employeesFile File are required');
  });

  it('should process files successfully (only employeesFile)', async () => {
  const filePath = path.resolve(__dirname, 'mocks', 'employees.csv');
  const res = await request(app.getHttpServer())
    .post('/secret-santa/upload')
    .attach('employeesFile', filePath) // field name must match interceptor
    .expect(201);
    expect(res.body).toEqual({
      message: 'Assignments created',
      downloadUrl: '/output/secret_santa_result.csv',
    });

    expect(httpService.post).toHaveBeenCalledWith(
      'http://localhost:3001/assignments',
      expect.objectContaining({
        employees: expect.any(Array),
        previousAssignments: [],
      }),
    );
  });

  it('should process files successfully (with previousYearFile)', async () => {
    const res = await request(app.getHttpServer())
      .post('/secret-santa/upload')
      .attach('employeesFile', path.join(__dirname, 'mocks/employees.csv'))
      .attach('previousYearFile', path.join(__dirname, 'mocks/previous.csv'))
      .expect(HttpStatus.CREATED);

    expect(res.body.message).toBe('Assignments created');
    expect(res.body.downloadUrl).toContain('secret_santa_result.csv');
  });

  it('should return 415 if unsupported file type is uploaded', async () => {
    const res = await request(app.getHttpServer())
      .post('/secret-santa/upload')
      .attach('employeesFile', path.join(__dirname, 'mocks/employees.txt'))
      .expect(HttpStatus.UNSUPPORTED_MEDIA_TYPE);

    expect(res.body.message).toBe('Only CSV and XLSX files are supported');
  });

  it('should return 500 if internal error occurs', async () => {
    jest.spyOn(httpService, 'post').mockImplementationOnce(() => {
      throw new Error('Processing failed');
    });

    const res = await request(app.getHttpServer())
      .post('/secret-santa/upload')
      .attach('employeesFile', path.join(__dirname, 'mocks/employees.csv'))
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);

    expect(res.body.message).toBe('Processing failed');
  });
});
