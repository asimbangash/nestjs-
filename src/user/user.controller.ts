import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image',{
    storage:diskStorage({
      destination:"files",
      filename:(req,file,cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1e9);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}-${ext}`;
        cb(null,filename);
      }
    })
  }))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createUserDto: CreateUserDto, @Req() req: Request) {
    if (!file) {
      return { error: 'No file was uploaded' };
    }
    const baseUrl = req.protocol + '://' + req.get('host');
    const imagePath = `${baseUrl}/${file.path}`;
    const user = { ...createUserDto, imagePath };
    const result = await this.userService.create(user);
    return result;
  
  }


  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
