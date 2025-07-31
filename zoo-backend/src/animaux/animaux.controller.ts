// animaux.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AnimauxService } from './animaux.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { AssignAnimalEnclosDto } from './dto/assign-animal-enclos.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles, RolesGuard } from 'src/auth/roles.guard';
import { AnimalDto } from './dto/animal.dto';

@ApiTags('Animals')
@Controller('animaux')
export class AnimauxController {
  constructor(private readonly service: AnimauxService) {}

// API DE TEST 

@ApiOperation({ 
  summary: 'Create a new animal (no auth required for testing)',
  description: 'Test endpoint to create a new animal without authentication'
})
@ApiResponse({
  status: 201,
  description: 'Animal successfully created',
  type: AnimalDto,
})
@ApiResponse({
  status: 400,
  description: 'Bad request - Invalid data provided'
})
@ApiBody({ 
  type: CreateAnimalDto,
  description: 'Animal data to create'
})
@Post('test')
createTest(@Body() dto: CreateAnimalDto) {
  return this.service.create(dto);
}

@ApiOperation({ 
  summary: 'Get animal by ID (no auth required for testing)',
  description: 'Test endpoint to retrieve an animal without authentication'
})
@ApiParam({
  name: 'id',
  description: 'The ID of the animal to retrieve',
  type: 'number'
})
@ApiResponse({
  status: 200,
  description: 'Animal found successfully',
  type: AnimalDto,
})
@ApiResponse({
  status: 404,
  description: 'Animal not found'
})
@Get('test/:id')
findOneTest(@Param('id', ParseIntPipe) id: number) {
  return this.service.findOne(id);
}

// API FONCTIONNELLES HORS TESTS

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a new animal',
    description: 'Creates a new animal in the zoo database. Only accessible by guardians.'
  })
  @ApiResponse({
    status: 201,
    description: 'Animal successfully created',
    type: AnimalDto,
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
    description: 'Forbidden - Only guardians can create animals'
  })
  @ApiBody({ 
    type: CreateAnimalDto,
    description: 'Animal data to create'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('gardien')
  @Post()
  create(@Body() dto: CreateAnimalDto) {
    return this.service.create(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'List all animals',
    description: 'Retrieves all animals from the zoo database. Accessible by all authenticated users.'
  })
  @ApiResponse({
    status: 200,
    description: 'List of all animals retrieved successfully',
    type: [AnimalDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('veterinaire', 'gardien', 'visiteur')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get animal by ID',
    description: 'Retrieves a specific animal by its ID. Requires authentication.'
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the animal to retrieve',
    type: 'number'
  })
  @ApiResponse({
    status: 200,
    description: 'Animal found successfully',
    type: AnimalDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions'
  })
  @ApiResponse({
    status: 404,
    description: 'Animal not found'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('veterinaire', 'gardien', 'visiteur')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }


  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Search animals by name',
    description: 'Search for animals by their name. Accessible by all authenticated users.'
  })
  @ApiQuery({
    name: 'name',
    description: 'The name to search for',
    type: 'string'
  })
  @ApiResponse({
    status: 200,
    description: 'Animals found successfully',
    type: [AnimalDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('veterinaire', 'gardien', 'visiteur')
  @Get('search/name')
  findByName(@Query('name') name: string) {
    return this.service.findByName(name);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete an animal',
    description: 'Deletes an animal from the zoo. Only accessible by guardians.'
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the animal to delete',
    type: 'number'
  })
  @ApiResponse({
    status: 200,
    description: 'Animal deleted successfully'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only guardians can delete animals'
  })
  @ApiResponse({
    status: 404,
    description: 'Animal not found'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('gardien')
  @Delete(':id')
  deleteWithId(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteWithId(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Heal an animal',
    description: 'Heals an animal by setting its health to 100. Only accessible by veterinarians.'
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the animal to heal',
    type: 'number'
  })
  @ApiResponse({
    status: 200,
    description: 'Animal healed successfully',
    type: AnimalDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only veterinarians can heal animals'
  })
  @ApiResponse({
    status: 404,
    description: 'Animal not found'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('veterinaire')
  @Get('soignerAnimal/:id')
  soignerAnimal(@Param('id', ParseIntPipe) id: number) {
    return this.service.soignerAnimal(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Assign animal to enclosure',
    description: 'Assigns an animal to a specific enclosure. Only accessible by guardians.'
  })
  @ApiResponse({
    status: 200,
    description: 'Animal successfully assigned to enclosure'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Enclosure full or not active'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only guardians can assign animals to enclosures'
  })
  @ApiResponse({
    status: 404,
    description: 'Animal or enclosure not found'
  })
  @ApiBody({ 
    type: AssignAnimalEnclosDto,
    description: 'Animal and enclosure assignment data'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('gardien')
  @Post('assigner-enclos')
  assignerEnclos(@Body() dto: AssignAnimalEnclosDto) {
    return this.service.assignerEnclos(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get animal enclosure',
    description: 'Retrieves the current enclosure assignment for an animal. Accessible by all authenticated users.'
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the animal',
    type: 'number'
  })
  @ApiResponse({
    status: 200,
    description: 'Animal enclosure assignment retrieved successfully'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @ApiResponse({
    status: 404,
    description: 'Animal not found'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('veterinaire', 'gardien', 'visiteur')
  @Get(':id/enclos')
  getAnimalEnclos(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAnimalEnclos(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Remove animal from enclosure',
    description: 'Removes an animal from its current enclosure. Only accessible by guardians.'
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the animal',
    type: 'number'
  })
  @ApiResponse({
    status: 200,
    description: 'Animal successfully removed from enclosure'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only guardians can remove animals from enclosures'
  })
  @ApiResponse({
    status: 404,
    description: 'Animal not found or not in any enclosure'
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('gardien')
  @Delete(':id/enclos')
  removeAnimalFromEnclos(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeAnimalFromEnclos(id);
  }
}
