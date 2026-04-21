const express=require('express');
const nodemailer=require('nodemailer');
require('dotenv').config();
const app=express();
app.use(express.json());
app.use(express.static(__dirname));

const transporter=nodemailer.createTransport({
 service:'gmail',
 auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}
});

app.post('/api/bookings',async(req,res)=>{
 const data=req.body;

 await transporter.sendMail({
  from:process.env.SMTP_USER,
  to:process.env.BUSINESS_EMAIL,
  subject:'New Tattoo Booking',
  text:JSON.stringify(data,null,2)
 });

 res.json({success:true});
});

app.listen(3000,()=>console.log('Server running'));
