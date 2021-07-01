import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// module
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TokenModule } from './modules/token/token.module';
import { AuthToolModule } from './modules/tool/auth-tool/auth-tool.module';
import { MessageModule } from './modules/message/message.module';
import { RoomModule } from './modules/room/room.module';
import { UploadModule } from './modules/upload/upload.module';

// controller
import { AppController } from './app.controller';

// service
import { AppService } from './app.service';

// configuration
import configuration from './config/configuration';

// secrets
import { MONGO_URI } from './common/config/secrets';
import { ChatModule } from './modules/chat/chat.module';

// import { RedisToolModule } from './modules/tool/redis-tool/redis-tool.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration]
		}),
		MongooseModule.forRoot(MONGO_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useFindAndModify: false,
			useCreateIndex: true,
			retryDelay: 5000,
		}),
		AuthModule,
		UserModule,
		TokenModule,
		AuthToolModule,
		MessageModule,
		RoomModule,
		ChatModule,
		UploadModule,
		// RedisToolModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
