import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXP, JWT_SECRET } from 'src/common/config/secrets';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secret: JWT_SECRET,
			signOptions: {
				expiresIn: JWT_EXP
			}
		})],
	providers: [UserService],
	controllers: [UserController],
	exports: [UserService]
})
export class UserModule { }
