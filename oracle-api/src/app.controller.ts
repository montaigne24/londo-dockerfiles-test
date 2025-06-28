import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getUsers() {
    return this.appService.getUsers();
  }

  @Post()
  async createUser(@Body() user: any) {
    return this.appService.createUser(user);
  }
}