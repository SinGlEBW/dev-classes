

export class DownloadFile {
  private static startSrt = 'data:application/';
  private static applications = {
    xls: `${DownloadFile.startSrt}vnd.ms-excel;`,
    xlsx: `${DownloadFile.startSrt}vnd.openxmlformats-officedocument.spreadsheetml.sheet;`,
    pdf: `${DownloadFile.startSrt}pdf;`,
    csv: `${DownloadFile.startSrt}vnd.ms-excel;`,

  }
  private static getDataApplication(format){
    const { applications } = DownloadFile;
    return applications[format] ? applications[format] : applications['pdf'];
  }

  static convertBase64To(attachment: Record<'name' | 'base64', string>&{format: keyof typeof DownloadFile.applications}): void {
    const { format, name, base64 } = attachment;

    const linkSource = `${DownloadFile.getDataApplication(format)}base64,${base64}`;
    const downloadLink = document.createElement('a');
    const fileName = `${name}.${format}`;
  
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}
