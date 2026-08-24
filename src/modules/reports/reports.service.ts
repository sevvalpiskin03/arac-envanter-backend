import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import { PrismaService } from '../../database/prisma.service';
import type { ExportReportQueryDto } from './dto/export-report-query.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async exportWorkbook(query: ExportReportQueryDto): Promise<Buffer> {
    const dateFilter = query.dateFrom || query.dateTo ? {
      serviceDate: {
        ...(query.dateFrom ? { gte: new Date(`${query.dateFrom}T00:00:00.000Z`) } : {}),
        ...(query.dateTo ? { lte: new Date(`${query.dateTo}T23:59:59.999Z`) } : {}),
      },
    } : {};
    const [vehicles, records] = await Promise.all([
      this.prisma.vehicle.findMany({
        where: query.companyId ? { companyId: query.companyId } : {},
        include: { company: true, unit: true }, orderBy: { plate: 'asc' },
      }),
      this.prisma.serviceRecord.findMany({
        where: { ...dateFilter, ...(query.companyId ? { vehicle: { companyId: query.companyId } } : {}) },
        include: { vehicle: { include: { company: true, unit: true } }, replacedParts: true },
        orderBy: { serviceDate: 'desc' },
      }),
    ]);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Filo Yönetimi'; workbook.created = new Date();
    const summary = workbook.addWorksheet('Özet', { views: [{ showGridLines: false }] });
    summary.columns = [{ width: 30 }, { width: 24 }];
    summary.mergeCells('A1:B1'); summary.getCell('A1').value = 'FİLO YÖNETİM RAPORU';
    summary.getCell('A3').value = 'Rapor tarihi'; summary.getCell('B3').value = new Date(); summary.getCell('B3').numFmt = 'dd.mm.yyyy hh:mm';
    summary.getCell('A5').value = 'Toplam araç'; summary.getCell('B5').value = vehicles.length;
    summary.getCell('A6').value = 'Bakım kaydı'; summary.getCell('B6').value = records.filter((r) => r.type === 'MAINTENANCE').length;
    summary.getCell('A7').value = 'Tamir kaydı'; summary.getCell('B7').value = records.filter((r) => r.type === 'REPAIR').length;
    summary.getCell('A8').value = 'Toplam maliyet'; summary.getCell('B8').value = records.reduce((sum, r) => sum + Number(r.totalCost), 0); summary.getCell('B8').numFmt = '#,##0.00 [$₺-tr-TR]';
    this.styleTitle(summary, 'A1:B1'); this.styleSummary(summary, 'A5:B8');

    const vehicleSheet = workbook.addWorksheet('Araç Envanteri', { views: [{ state: 'frozen', ySplit: 1 }] });
    vehicleSheet.columns = [
      { header:'Plaka',key:'plate',width:16 },{header:'Marka',key:'brand',width:18},{header:'Model',key:'model',width:20},{header:'Model Yılı',key:'year',width:12},{header:'Araç Türü',key:'vehicleType',width:18},{header:'Güncel Km',key:'mileage',width:14},{header:'Ruhsat / Şirket Sahibi',key:'owner',width:28},{header:'Şirket',key:'company',width:24},{header:'Kullanan Birim',key:'unit',width:22},{header:'HGS',key:'hgs',width:10},{header:'Son Bakım Km',key:'last',width:15},{header:'Sonraki Bakım Km',key:'next',width:18},{header:'Not',key:'note',width:30},
    ];
    vehicles.forEach((v) => vehicleSheet.addRow({ plate:v.plate,brand:v.brand,model:v.model,year:v.modelYear,vehicleType:v.vehicleType,mileage:v.currentMileage,owner:v.registeredOwner,company:v.company.name,unit:v.unit.name,hgs:v.hasHgs?'Var':'Yok',last:v.lastMaintenanceMileage,next:v.nextMaintenanceMileage,note:v.note }));
    this.styleTable(vehicleSheet); ['F','K','L'].forEach((column) => { vehicleSheet.getColumn(column).numFmt = '#,##0'; });

    const serviceSheet = workbook.addWorksheet('Bakım ve Tamir', { views: [{ state: 'frozen', ySplit: 1 }] });
    serviceSheet.columns = [
      {header:'Tarih',key:'date',width:14},{header:'Tür',key:'type',width:12},{header:'Plaka',key:'plate',width:16},{header:'Araç',key:'vehicle',width:24},{header:'Şirket',key:'company',width:24},{header:'Birim',key:'unit',width:20},{header:'İşlem Km',key:'mileage',width:14},{header:'Yapılan İşlemler',key:'work',width:42},{header:'Değişen Parçalar',key:'parts',width:38},{header:'Servis / Usta',key:'provider',width:24},{header:'Toplam Maliyet',key:'cost',width:18},{header:'Sonraki Bakım Km',key:'next',width:19},{header:'Not',key:'note',width:32},
    ];
    records.forEach((r) => serviceSheet.addRow({date:r.serviceDate,type:r.type==='MAINTENANCE'?'Bakım':'Tamir',plate:r.vehicle.plate,vehicle:`${r.vehicle.brand} ${r.vehicle.model}`,company:r.vehicle.company.name,unit:r.vehicle.unit.name,mileage:r.mileageAtService,work:r.performedWork,parts:r.replacedParts.map((p)=>p.name).join(', '),provider:r.provider,cost:Number(r.totalCost),next:r.nextMaintenanceMileage,note:r.note}));
    this.styleTable(serviceSheet); serviceSheet.getColumn('A').numFmt='dd.mm.yyyy'; serviceSheet.getColumn('G').numFmt='#,##0'; serviceSheet.getColumn('K').numFmt='#,##0.00 [$₺-tr-TR]'; serviceSheet.getColumn('L').numFmt='#,##0';

    const output = await workbook.xlsx.writeBuffer();
    return Buffer.from(output);
  }

  private styleTitle(sheet: ExcelJS.Worksheet, range: string) { const cell=sheet.getCell('A1'); cell.font={bold:true,size:18,color:{argb:'FFFFFFFF'}};cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF075D70'}};cell.alignment={vertical:'middle',horizontal:'center'};sheet.getRow(1).height=34; sheet.getCell(range.split(':')[1]).fill=cell.fill; }
  private styleSummary(sheet: ExcelJS.Worksheet, range: string) { for(const row of sheet.getRows(Number(range[1]),4)??[]){row.getCell(1).font={bold:true,color:{argb:'FF35505B'}};row.eachCell((cell)=>{cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFF2F7F8'}};cell.border={bottom:{style:'thin',color:{argb:'FFDDE6E9'}}};});} }
  private styleTable(sheet: ExcelJS.Worksheet) { const header=sheet.getRow(1);header.height=28;header.eachCell((cell)=>{cell.font={bold:true,color:{argb:'FFFFFFFF'}};cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF075D70'}};cell.alignment={vertical:'middle'};});sheet.autoFilter={from:{row:1,column:1},to:{row:1,column:sheet.columnCount}};sheet.eachRow((row,index)=>{if(index>1){row.alignment={vertical:'top',wrapText:true};if(index%2===1)row.eachCell((cell)=>cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFF5F9FA'}});}}); }
}
