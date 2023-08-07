const { mongoose } = require("mongoose")
const Spreadsheet = require("../models/Spreadsheet")
const User = require("../models/User")
const Workspace = require("../models/Workspace")
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

const shareWorkspace = async (req, res) => {
    try {
        const { id } = req.params
        const { access, invitee } = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid workspace id' })
        }

        if (!access && !invitee) {
            return res.status(500).json({ message: 'Access or invitee is required' })
        }

        if (invitee) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(invitee)) {
                return res.status(400).json({ message: 'Invalid invitee email' })
            }
        }


        const workspace = await Workspace.findOne({ _id: id, orgName: { $in: req.user.orgs }, members: { $in: [req.user._id] } }).populate('members')

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' })
        }

        if (access?.trim()) {
            if (access != 'public' && access != 'private') {
                return res.status(400).json({ message: 'Invalid access. Access should private or public' })
            }
        }

        if (access) {
            workspace.access = access
        }

        if (invitee) {
            {
                const inviteeInWorkspace = workspace?.members.find((member) => (
                    String(member?.email) == String(invitee)
                ))
                if (inviteeInWorkspace) {
                    return res.status(400).json({ message: 'User already in workspace' })
                }

                const inviteeInOrg = await User.findOne({ email: invitee, orgs: { $in: [workspace.orgName] } })

                if (!inviteeInOrg) {
                    const inviteeAsUser = await User.findOne({ email: invitee })

                    if (inviteeAsUser) {
                        workspace.members = [...workspace.members.map((member) => member._id), inviteeAsUser._id]

                        inviteeAsUser.orgs = [...inviteeAsUser.orgs, workspace.orgName]

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
                            to: invitee,
                            subject: `Welcome to ${workspace.name}`,
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
                        <h1>Hi ${invitee}</h1>
                        <p>You have just been added to <strong>${workspace.name}</strong> workspace by ${req.user.email}. You can now view this workspace and it contents</p>
                        <!-- Action -->
                        <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td align="center">
                              <!-- Border based button
           https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design -->
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

                    } else {
                        let newAccountPassword = ''
                        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

                        for (let i = 0; i < 6; i++) {
                            const randomIndex = Math.floor(Math.random() * charset.length);
                            newAccountPassword += charset[randomIndex];
                        }

                        const hashedPassword = await bcrypt.hash(newAccountPassword, 10)

                        const user = await User.create({ email: invitee, password: hashedPassword, orgs: [workspace.orgName] })

                        workspace.members = [...workspace.members.map((member) => member._id), user._id]

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
                            to: invitee,
                            subject: `Welcome to ${workspace.name}`,
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
                        <h1>Hi ${invitee}</h1>
                        <p>You have just been added to <strong>${workspace.name}</strong> workspace by ${req.user.email}. You can now view this workspace and it contents. <b/> Here is your login credentials:</p>
                        <p><strong>Email :</strong> <span>${invitee}</span></p>
                        <p><strong>Password :</strong> <span>${newAccountPassword}</span></p>
                        <!-- Action -->
                        <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td align="center">
                              <!-- Border based button
           https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design -->
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
                    }
                } else {
                    workspace.members = [...workspace.members.map((member) => member._id), inviteeInOrg._id]
                }
            }
        }

        await workspace.save()

        res.status(200).json({ workspace: workspace._id })

    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
}

const shareSpreadsheet = async (req, res) => {
    try {
        const { id } = req.params
        const { access } = req.body


        const spreadsheet = await Spreadsheet.findById(id).populate('workspace')

        if (!spreadsheet) {
            return res.status(404).json({ message: 'Spreadsheet not found' })
        }

        const workspace = await Workspace.findById(spreadsheet.workspace)

        const userInWorkspace = workspace?.members.find((member) => (
            String(member) == String(req.user._id)
        ))

        if (!userInWorkspace) {
            return res.status(404).json({ message: 'Spreadsheet not found' })
        }

        if (access?.trim()) {
            if (access != 'public' && access != 'private') {
                return res.status(400).json({ message: 'Invalid access. Access should private or public' })
            }
        }

        spreadsheet.access = access

        await spreadsheet.save()

        return res.status(200).json({ spreadsheetId: spreadsheet._id })

    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
}

const getWorkspace = async (req, res) => {
    try {
        const { id } = req.params

        const workspace = await Workspace.findOne({
            _id: id,
            archived: false
        })

        if (!workspace || workspace?.access != 'public') {
            return res.status(404).json({ message: 'Spreadsheet not found' })
        }

        const spreadsheets = await Spreadsheet.find({ workspace: id, archived: false })

        return res.status(200).json({ spreadsheets, workspace })
    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
}

const getSpreadsheet = async (req, res) => {
    try {
        const { id } = req.params
        const spreadsheet = await Spreadsheet.findOne({ _id: id, access: 'public' })

        if (!spreadsheet) {
            return res.status(404).json({ message: 'Spreadsheet not found' })
        }

        res.status(200).json({ spreadsheet })

    } catch (error) {
        res.sendStatus(500)
    }
}


module.exports = {
    shareWorkspace,
    shareSpreadsheet,
    getWorkspace,
    getSpreadsheet
}
