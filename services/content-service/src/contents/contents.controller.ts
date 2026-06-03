import { Controller, Post, Body, Req, Param, Put, Delete, Get, BadRequestException, UseGuards } from '@nestjs/common'
import { ContentsService } from './contents.service'
import { JwtAuthGuard } from '../common/jwt-auth.guard'

@Controller('contents')
export class ContentsController {
  constructor(private svc: ContentsService){}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req:any, @Body() body:any){
    const user = req.user as any
    if(!user || !user.id) throw new BadRequestException('invalid_user')
    return this.svc.create(String(user.tenantId), { ...body, authorId: user.id })
  }

  @Get()
  async list(@Req() req:any){
    const tenantId = req.headers['x-tenant-id']
    return this.svc.find(String(tenantId))
  }

  @Get(':id')
  async get(@Req() req:any, @Param('id') id:string){
    const tenantId = req.headers['x-tenant-id']
    return this.svc.findById(String(tenantId), id)
  }

  @Put(':id')
  async update(@Req() req:any, @Param('id') id:string, @Body() body:any){
    const tenantId = req.headers['x-tenant-id']
    return this.svc.update(String(tenantId), id, body)
  }

  @Post(':id/submit')
  async submit(@Req() req:any, @Param('id') id:string){
    // transition DRAFT -> IN_REVIEW
    return this.svc.update(req.headers['x-tenant-id'], id, { status: 'IN_REVIEW' })
  }

  @Post(':id/publish')
  async publish(@Req() req:any, @Param('id') id:string){
    // Only Staff allowed — auth handled elsewhere; here assume caller validated
    return this.svc.update(req.headers['x-tenant-id'], id, { status: 'PUBLISHED' })
  }

  @Delete(':id')
  async delete(@Req() req:any, @Param('id') id:string){
    return this.svc.softDelete(req.headers['x-tenant-id'], id)
  }
}
