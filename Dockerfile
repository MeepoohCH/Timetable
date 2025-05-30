FROM node:18

# กำหนด working directory ใน container
WORKDIR /app

# คัดลอก package.json และ package-lock.json ไปก่อน เพื่อแยกติดตั้ง dependencies
COPY package.json package-lock.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโฟลเดอร์ app เข้าไปใน container
COPY ./app ./app

# ถ้า Next.js อยู่ในโฟลเดอร์ app และรันคำสั่งในนั้น
WORKDIR /app/app

# สร้าง production build
RUN npm run build

# expose port 3000
EXPOSE 3000

# รันแอป (สมมติสคริปต์ start รันจากโฟลเดอร์ app)
CMD ["npm", "start"]
