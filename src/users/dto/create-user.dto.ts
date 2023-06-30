import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  
  @ApiProperty({
    description: "The email of the User",
    example: "user@gmail.ru",
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: "The password of the User",
    example: "passWord123@",
  })
  @IsString()
  password: string;

  @ApiProperty({ 
    description: "The userName of the User", 
    example: "userName" 
  })
  @IsOptional()
  @IsString()
  userName: string;

  @ApiProperty({ 
    description: "The name of the User", 
    example: "Victor" 
  })
  @IsOptional()
  @IsString()
  name: string;
}
