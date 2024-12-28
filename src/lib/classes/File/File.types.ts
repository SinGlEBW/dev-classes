export type FileFormat_OR = 'xls' | 'xlsx' | 'pdf' | 'csv';
export type FileConfig_P = Record<FileFormat_OR, string> 
export interface FileProps {
  download(attachment: Record<'name' | 'base64', string>&{format: FileFormat_OR}): void
}