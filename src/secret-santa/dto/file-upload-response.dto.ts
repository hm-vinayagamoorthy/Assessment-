export interface SecretSantaRecord {
  Employee_Name: string;
  Employee_EmailID: string;
  Secret_Child_Name: string;
  Secret_Child_EmailID: string;
}
export class FileUploadResponseDto {
  message: string;
  downloadUrl: string;
  csvContent:SecretSantaRecord[];
}