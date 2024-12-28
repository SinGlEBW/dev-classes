
import { FileFormat_OR, FileProps } from './File.types';

export class File {
  private static startSrt = 'data:application/';
  private static applications = {
    xls: `${File.startSrt}vnd.ms-excel;`,
    xlsx: `${File.startSrt}vnd.openxmlformats-officedocument.spreadsheetml.sheet;`,
    pdf: `${File.startSrt}pdf;`,
    csv: `${File.startSrt}vnd.ms-excel;`,
  }
  private static getDataApplication(format: FileFormat_OR){
    const { applications } = File;
    return applications[format] ? applications[format] : applications['pdf'];
  }

  static download:FileProps['download'] = (attachment) => {
    const { format, name, base64 } = attachment;
    
    const linkSource = `${File.getDataApplication(format)}base64,${base64}`;
    const downloadLink = document.createElement('a');
    const fileName = `${name}.${format}`;
  
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}

