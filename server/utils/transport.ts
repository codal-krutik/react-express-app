import nodemailer, { type Transporter } from "nodemailer";

export const transporter: Transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
  ignoreTLS: true
});
