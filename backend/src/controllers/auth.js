const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const Token = require('../models/Token')
const nodemailer = require('nodemailer')

const createAccount = async (req, res) => {
  try {
    const { email, password, orgName, termsAndConditionsAgreed } = req.body

    if (!(orgName?.trim())) {
      return res.status(400).json({ message: 'Organization name is required' })
    }

    if (!(email?.trim())) {
      return res.status(400).json({ message: 'Email is required' })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email' })
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password should be atleast 6 characters long' })
    }

    if (!termsAndConditionsAgreed || !(JSON.parse(termsAndConditionsAgreed))) {
      return res.status(400).json({ message: 'Terms and conditions must be agreed' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User exists' })
    }

    const user = await User.create({ email, password: hashedPassword, orgs: [orgName] })

    const token = jwt.sign({ _id: user._id, email, orgs: [orgName] }, process.env.JWT_SECRET)

    res.status(201).json({ message: 'Account created successfully', token })

  } catch (error) {
    console.log(error.message)
    res.sendStatus(500)
  }
}

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!(email?.trim())) {
      return res.status(400).json({ message: 'Email is required' })
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ _id: user._id, user: user.email, orgName: user.orgName }, process.env.JWT_SECRET)

    res.status(200).json({ token })

  } catch (error) {
    console.log(error.message)
    res.sendStatus(500)
  }
}

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let genToken = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      genToken += chars.charAt(randomIndex);
    }

    const token = await Token.create({ token: genToken, user: user._id, purpose: 'password-reset' })

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      secureConnection: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS
      }
    });


    const mailOptions = {
      from: 'sakawahab03@gmail.com',
      to: user.email,
      subject: 'Airpri password reset token',
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title></title>
    <style type="text/css" rel="stylesheet" media="all">
    /* Base ------------------------------ */
    @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
    body {
      width: 100% !important;
      height: 100%;
      margin: 0;
      -webkit-text-size-adjust: none;
    }
    a {
      color: #3869D4;
    }
    a img {
      border: none;
    }
    td {
      word-break: break-word;
    }
    .preheader {
      display: none !important;
      visibility: hidden;
      mso-hide: all;
      font-size: 1px;
      line-height: 1px;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
    }
    body,
    td,
    th {
      font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
    }
    h1 {
      margin-top: 0;
      color: #333333;
      font-size: 22px;
      font-weight: bold;
      text-align: left;
    }
    
    td,
    th {
      font-size: 16px;
    }
    
    p,
    ul,
    ol,
    blockquote {
      margin: .4em 0 1.1875em;
      font-size: 16px;
      line-height: 1.625;
    }
    
    p.sub {
      font-size: 13px;
    }
    /* Utilities ------------------------------ */
    
    .align-right {
      text-align: right;
    }
    
    .align-left {
      text-align: left;
    }
    
    .align-center {
      text-align: center;
    }
    
    .u-margin-bottom-none {
      margin-bottom: 0;
    }
    /* Buttons ------------------------------ */
    .button {
      display: inline-block;
      color: #FFF;
      text-decoration: none;
      border-radius: 3px;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
      -webkit-text-size-adjust: none;
      box-sizing: border-box;
      font-size: 24px;
      font-weight: bold
    }
    .button--green {
      background-color: #071f3b;
      padding: 10px 20px;
    }
    
    @media only screen and (max-width: 500px) {
      .button {
        width: 100% !important;
        text-align: center !important;
      }
    }

    /* Social Icons ------------------------------ */
    
    .social {
      width: auto;
    }
    
    .social td {
      padding: 0;
      width: auto;
    }
    
    .social_icon {
      height: 20px;
      margin: 0 8px 10px 8px;
      padding: 0;
    }
    /* Data table ------------------------------ */
    
    
    body {
      background-color: #F2F4F6;
      color: #51545E;
    }
    
    p {
      color: #51545E;
    }
    
    .email-wrapper {
      width: 100%;
      margin: 0;
      padding: 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      background-color: #F2F4F6;
    }
    
    .email-content {
      width: 100%;
      margin: 0;
      padding: 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }
    /* Masthead ----------------------- */
    
    .email-masthead {
      padding: 25px 0;
      text-align: center;
    }
    
    .email-masthead_logo {
      width: 94px;
    }
    
    .email-masthead_name {
      font-size: 16px;
      font-weight: bold;
      color: #A8AAAF;
      text-decoration: none;
      text-shadow: 0 1px 0 white;
    }
    /* Body ------------------------------ */
    
    .email-body {
      width: 100%;
      margin: 0;
      padding: 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }
    
    .email-body_inner {
      width: 570px;
      margin: 0 auto;
      padding: 0;
      -premailer-width: 570px;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      background-color: #FFFFFF;
    }
    
    .email-footer {
      width: 570px;
      margin: 0 auto;
      padding: 0;
      -premailer-width: 570px;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      text-align: center;
    }
    
    .email-footer p {
      color: #A8AAAF;
    }
    
    .body-action {
      width: 100%;
      margin: 30px auto;
      padding: 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      text-align: center;
    }
    
    .body-sub {
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #EAEAEC;
    }
    
    .content-cell {
      padding: 45px;
    }
    /*Media Queries ------------------------------ */
    
    @media only screen and (max-width: 600px) {
      .email-body_inner,
      .email-footer {
        width: 100% !important;
      }
    }
    
    @media (prefers-color-scheme: dark) {
      body,
      .email-body,
      .email-body_inner,
      .email-content,
      .email-wrapper,
      .email-masthead,
      .email-footer {
        background-color: #333333 !important;
        color: #FFF !important;
      }
      p,
      ul,
      ol,
      blockquote,
      h1,
      h2,
      h3,
      span,
      .purchase_item {
        color: #FFF !important;
      }
      .attributes_content,
      .discount {
        background-color: #222 !important;
      }
      .email-masthead_name {
        text-shadow: none !important;
      }
    }
    
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    </style>
    <!--[if mso]>
    <style type="text/css">
      .f-fallback  {
        font-family: Arial, sans-serif;
      }
    </style>
  <![endif]-->
  </head>
  <body>
    <span class="preheader">Use this token to reset your password. The link is only valid for 1hr.</span>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <!-- Email Body -->
            <tr>
              <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                  <!-- Body content -->
                  <tr>
                    <td class="content-cell">
                      <div class="f-fallback">
                        <h1>Hi ${user.email},</h1>
                        <p>You recently requested to reset your password for your Airpri account. Use the button below to reset it. <strong>This password reset token is only valid for the next 1hour.</strong></p>
                        <!-- Action -->
                        <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td align="center">
                              <!-- Border based button
           https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design -->
                              <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                <tr>
                                  <td align="center">
                                    <p class="f-fallback button button--green">${token.token}</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <p>Thanks,
                          <br>The Airpri team</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="content-cell" align="center">
                      <p class="f-fallback sub align-center">
                        Airpri
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset token sent' })

  } catch (error) {
    console.log(error.message)
    res.sendStatus(500)
  }
}

const resetPassword = async (req, res) => {
  try {
    const { email, password, token } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }
    if (!password) {
      return res.status(400).json({ message: 'New password is required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password should be atleast 6 characters long' })
    }
    if (!token) {
      return res.status(400).json({ message: 'Password reset token is required' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const tokenObj = await Token.findOne({ token })
    if (!tokenObj) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }

    if (tokenObj.purpose != 'password-reset') {
      return res.status(400).json({ message: 'Invalid token' })
    }

    if (tokenObj.used) {
      return res.status(400).json({ message: 'Used token' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user.password = hashedPassword

    await user.save()

    await tokenObj.deleteOne()

    res.status(200).json({ message: 'Password reset successful' })

  } catch (error) {
    console.log(error.message)
    res.sendStatus(500)
  }
}

module.exports = {
  createAccount,
  signIn,
  requestPasswordReset,
  resetPassword
}