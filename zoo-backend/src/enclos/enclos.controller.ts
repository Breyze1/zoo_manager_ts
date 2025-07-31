import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { EnclosService } from './enclos.service';
import { CreateEnclosDto } from './dto/create-enclos.dto';
import { EnclosDto } from './dto/enclos.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Enclosures')
@Controller('enclos')
export class EnclosController {
  constructor(private readonly enclosService: EnclosService) {}

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a new enclosure',
    description: 'Creates a new enclosure in the zoo. Only accessible by guardians.'
  })
  @ApiResponse({
    status: 201,
    description: 'Enclosure created successfully',
    type: EnclosDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only guardians can create enclosures'
  })
  @ApiBody({ 
    type: CreateEnclosDto,
    description: 'Enclosure data to create'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('gardien')
  @Post()
  create(@Body() dto: CreateEnclosDto) {
    return this.enclosService.create(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'List all enclosures',
    description: 'Retrieves all enclosures from the zoo. Accessible by all authenticated users.'
  })
  @ApiResponse({
    status: 200,
    description: 'List of all enclosures retrieved successfully',
    type: [EnclosDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('veterinaire', 'gardien', 'visiteur')
  @Get()
  findAll() {
    return this.enclosService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get enclosure by ID',
    description: 'Retrieves a specific enclosure by its ID. Accessible by all authenticated users.'
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the enclosure to retrieve',
    type: 'number'
  })
  @ApiResponse({
    status: 200,
    description: 'Enclosure found successfully',
    type: EnclosDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @ApiResponse({
    status: 404,
    description: 'Enclosure not found'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('veterinaire', 'gardien', 'visiteur')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enclosService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update an enclosure',
    description: 'Updates an existing enclosure. Only accessible by guardians.'
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the enclosure to update',
    type: 'number'
  })
  @ApiResponse({
    status: 200,
    description: 'Enclosure updated successfully',
    type: EnclosDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only guardians can update enclosures'
  })
  @ApiResponse({
    status: 404,
    description: 'Enclosure not found'
  })
  @ApiBody({ 
    type: CreateEnclosDto,
    description: 'Enclosure data to update'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('gardien')
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateEnclosDto>) {
    return this.enclosService.update(id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete an enclosure',
    description: 'Deletes an enclosure from the zoo. Only accessible by guardians.'
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the enclosure to delete',
    type: 'number'
  })
  @ApiResponse({
    status: 200,
    description: 'Enclosure deleted successfully'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only guardians can delete enclosures'
  })
  @ApiResponse({
    status: 404,
    description: 'Enclosure not found'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('gardien')
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.enclosService.delete(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Search enclosures by type',
    description: 'Search for enclosures by their type. Accessible by all authenticated users.'
  })
  @ApiQuery({
    name: 'type',
    description: 'The type of enclosure to search for',
    type: 'string'
  })
  @ApiResponse({
    status: 200,
    description: 'Enclosures found successfully',
    type: [EnclosDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('veterinaire', 'gardien', 'visiteur')
  @Get('search/type')
  findByType(@Query('type') type: string) {
    return this.enclosService.findByType(type);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Search enclosures by status',
    description: 'Search for enclosures by their status. Accessible by all authenticated users.'
  })
  @ApiQuery({
    name: 'status',
    description: 'The status of enclosure to search for',
    type: 'string'
  })
  @ApiResponse({
    status: 200,
    description: 'Enclosures found successfully',
    type: [EnclosDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('veterinaire', 'gardien', 'visiteur')
  @Get('search/status')
  findByStatus(@Query('status') status: string) {
    return this.enclosService.findByStatus(status);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update enclosure status',
    description: 'Updates the status of an enclosure (active, maintenance, closed). Only accessible by guardians.'
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the enclosure to update',
    type: 'number'
  })
  @ApiResponse({
    status: 200,
    description: 'Enclosure status updated successfully',
    type: EnclosDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid status provided'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only guardians can update enclosure status'
  })
  @ApiResponse({
    status: 404,
    description: 'Enclosure not found'
  })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['active', 'maintenance', 'closed'],
          description: 'The new status for the enclosure'
        }
      },
      required: ['status']
    },
    description: 'Status update data'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('gardien')
  @Patch(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: { status: string }) {
    return this.enclosService.updateStatus(id, body.status);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get animals in enclosure',
    description: 'Retrieves all animals currently in a specific enclosure. Accessible by all authenticated users.'
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the enclosure',
    type: 'number'
  })
  @ApiResponse({
    status: 200,
    description: 'Animals in enclosure retrieved successfully'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @ApiResponse({
    status: 404,
    description: 'Enclosure not found'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('veterinaire', 'gardien', 'visiteur')
  @Get(':id/animals')
  getAnimalsInEnclos(@Param('id', ParseIntPipe) id: number) {
    return this.enclosService.getAnimalsInEnclos(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Recalculate all enclosures occupancy',
    description: 'Recalculates the current occupancy for all enclosures based on actual animal assignments. Only accessible by guardians.'
  })
  @ApiResponse({
    status: 200,
    description: 'All enclosures occupancy recalculated successfully'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only guardians can recalculate occupancy'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('gardien')
  @Post('recalculate-occupancy')
  recalculateAllEnclosOccupancy() {
    return this.enclosService.recalculateAllEnclosOccupancy();
  }
} 