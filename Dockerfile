FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

ENV NODE_ENV=production
ENV PORT=8080
ENV COOKIE_NAME=techstore-bhos
ENV SECRET=daylabimat
ENV VNP_Url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
ENV VNP_Api=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
ENV VNP_ReturnUrl="/api/payment/vnpay_return"

RUN chown -R node:node /usr/src/app
RUN chmod 755 /usr/src/app
USER node
EXPOSE 8080
CMD [ "node", "dist/app.js" ]
