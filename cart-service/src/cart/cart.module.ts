import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';


@Module({
  imports: [ OrderModule ],
  providers: [ CartService, AuthModule ],
  controllers: [ CartController ]
})
export class CartModule {}
