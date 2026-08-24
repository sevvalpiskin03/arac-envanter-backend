import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsBoolean, IsEmail, IsInt, Max, Min } from 'class-validator';

export class UpdateNotificationSettingsDto {
  @Type(() => Number)
  @IsInt()
  @Min(100)
  @Max(10000)
  warningMileageThreshold!: number;

  @IsBoolean()
  emailEnabled!: boolean;

  @IsArray()
  @ArrayMaxSize(20)
  @IsEmail({}, { each: true })
  recipientEmails!: string[];
}
