import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const companies = [
  { name: 'Aydın Lojistik A.Ş.', units: ['Filo Operasyon', 'Depo ve Sevkiyat', 'İdari İşler'] },
  { name: 'Mavi Deniz Turizm Ltd.', units: ['Tur Operasyon', 'Transfer', 'Teknik Hizmetler'] },
  { name: 'Kuzey Yapı Sanayi A.Ş.', units: ['Şantiye', 'Satın Alma', 'Saha Operasyon'] },
];

const vehicles = [
  ['34 ABC 123','Ford','Transit',2021,'Panelvan',84200,'Aydın Lojistik A.Ş.','Filo Operasyon',true,90000],
  ['34 XYZ 456','Mercedes','Sprinter',2020,'Panelvan',119400,'Aydın Lojistik A.Ş.','Depo ve Sevkiyat',true,120000],
  ['34 LJK 908','Renault','Master',2019,'Kamyonet',156200,'Aydın Lojistik A.Ş.','Depo ve Sevkiyat',false,155000],
  ['34 AYD 071','Fiat','Doblo',2022,'Hafif Ticari',47200,'Aydın Lojistik A.Ş.','İdari İşler',true,50000],
  ['34 FLT 225','Ford','Courier',2023,'Hafif Ticari',28600,'Aydın Lojistik A.Ş.','Filo Operasyon',true,30000],
  ['34 TRZ 610','Volkswagen','Crafter',2021,'Minibüs',88100,'Mavi Deniz Turizm Ltd.','Tur Operasyon',true,90000],
  ['34 MDN 445','Mercedes','Vito',2022,'Minibüs',61900,'Mavi Deniz Turizm Ltd.','Transfer',true,65000],
  ['34 TUR 202','Ford','Tourneo',2023,'Minibüs',34400,'Mavi Deniz Turizm Ltd.','Transfer',true,35000],
  ['34 DNZ 118','Renault','Trafic',2020,'Minibüs',128900,'Mavi Deniz Turizm Ltd.','Tur Operasyon',true,130000],
  ['34 MVT 731','Toyota','Proace',2022,'Minibüs',55900,'Mavi Deniz Turizm Ltd.','Teknik Hizmetler',false,60000],
  ['34 KYS 314','Toyota','Hilux',2021,'Pikap',96800,'Kuzey Yapı Sanayi A.Ş.','Şantiye',true,100000],
  ['34 SNT 902','Ford','Ranger',2020,'Pikap',142600,'Kuzey Yapı Sanayi A.Ş.','Saha Operasyon',true,145000],
  ['34 YAP 667','Mitsubishi','L200',2019,'Pikap',181200,'Kuzey Yapı Sanayi A.Ş.','Şantiye',false,180000],
  ['34 KZY 410','Isuzu','NPR',2018,'Kamyon',237500,'Kuzey Yapı Sanayi A.Ş.','Saha Operasyon',true,240000],
  ['34 SAT 083','Fiat','Fiorino',2023,'Hafif Ticari',22600,'Kuzey Yapı Sanayi A.Ş.','Satın Alma',true,25000],
] as const;

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL gereklidir.');
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    const admin = await prisma.admin.findFirst({ where: { isActive: true } });
    if (!admin) throw new Error('Seed için önce bir yönetici oluşturulmalıdır.');
    const companyMap = new Map<string,string>(); const unitMap = new Map<string,string>();
    for (const item of companies) {
      const company = await prisma.company.upsert({ where:{name:item.name}, update:{}, create:{name:item.name,note:'Örnek şirket kaydı'} }); companyMap.set(item.name,company.id);
      for (const name of item.units) { const unit=await prisma.unit.upsert({where:{companyId_name:{companyId:company.id,name}},update:{},create:{companyId:company.id,name}});unitMap.set(`${item.name}:${name}`,unit.id); }
    }
    for (const [index,v] of vehicles.entries()) {
      const [plate,brand,model,modelYear,vehicleType,currentMileage,companyName,unitName,hasHgs,nextMaintenanceMileage]=v;
      const companyId=companyMap.get(companyName)!;const unitId=unitMap.get(`${companyName}:${unitName}`)!;
      const vehicle=await prisma.vehicle.upsert({where:{plate},update:{brand,model,modelYear,vehicleType,currentMileage,companyId,unitId,hasHgs,nextMaintenanceMileage},create:{plate,brand,model,modelYear,vehicleType,currentMileage,ownerType:index%4===0?'PERSON':'COMPANY',registeredOwner:index%4===0?['Ahmet Yıldız','Elif Kaya','Mehmet Demir','Selin Aras'][index%4]:companyName,companyId,unitId,hasHgs,lastMaintenanceMileage:Math.max(0,currentMileage-9000),nextMaintenanceMileage,note:index%5===0?'Yoğun kullanımda örnek araç':undefined}});
      const recordId=`00000000-0000-4000-8000-${String(index+1).padStart(12,'0')}`; const isRepair=index%3===0;
      const data={vehicleId:vehicle.id,type:isRepair?'REPAIR' as const:'MAINTENANCE' as const,serviceDate:new Date(2026,Math.max(0,7-(index%6)),5+(index%20)),mileageAtService:Math.max(0,currentMileage-(1500+index*120)),performedWork:isRepair?'Fren sistemi kontrolü ve parça değişimi':'Periyodik yağ, filtre ve genel kontrol',provider:['Öz Kaya Oto Servis','Merkez Filo Servisi','Güven Otomotiv'][index%3],totalCost:isRepair?4800+index*310:2750+index*180,note:index%2===0?'Test sürüşü tamamlandı.':undefined,nextMaintenanceMileage,replacedParts:{create:isRepair?[{name:'Fren balatası'},{name:'Fren hidroliği'}]:[{name:'Motor yağı'},{name:'Yağ filtresi'},{name:'Hava filtresi'}]},createdById:admin.id};
      const existing=await prisma.serviceRecord.findUnique({where:{id:recordId}}); if(existing) await prisma.serviceRecord.update({where:{id:recordId},data:{...data,replacedParts:{deleteMany:{},...data.replacedParts}}}); else await prisma.serviceRecord.create({data:{id:recordId,...data}});
    }
    console.log(`Seed tamamlandı: ${companies.length} şirket, ${companies.reduce((n,c)=>n+c.units.length,0)} birim, ${vehicles.length} araç ve ${vehicles.length} servis kaydı.`);
  } finally { await prisma.$disconnect(); }
}
void seed().catch((error:unknown)=>{console.error(error instanceof Error?error.message:error);process.exitCode=1;});
