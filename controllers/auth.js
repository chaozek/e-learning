import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import easyinvoice from "easyinvoice";
var fs = require("fs");

const client = new AWS.SES({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  apiVersion: process.env.AWS_API_VERSION,
});
const clientS3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  apiVersion: process.env.AWS_API_VERSION,
});
const S3 = new AWS.S3(clientS3);

export const createInvoice = async (req, res) => {
  var data = {
    // Customize enables you to provide your own templates
    // Please review the documentation for instructions and examples
    customize: {
      //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
    },
    images: {
      // The logo on top of your invoice
      logo: "https://public.easyinvoice.cloud/img/logo_en_original.png",
      // The invoice background
    },
    // Your own data
    sender: {
      company: "Sample Corp",
      address: "Sample Street 123",
      zip: "1234 AB",
      city: "Sampletown",
      country: "Samplecountry",
      //"custom1": "custom value 1",
      //"custom2": "custom value 2",
      //"custom3": "custom value 3"
    },
    // Your recipient
    client: {
      company: "Client Corp",
      address: "Clientstreet 456",
      zip: "4567 CD",
      city: "Clientcity",
      country: "Clientcountry",
      // "custom1": "custom value 1",
      // "custom2": "custom value 2",
      // "custom3": "custom value 3"
    },
    information: {
      // Invoice number
      number: "2021.0001",
      // Invoice data
      date: "12-12-2021",
      // Invoice due date
      "due-date": "31-12-2021",
    },
    // The products you would like to see on your invoice
    // Total values are being calculated automatically
    products: [
      {
        quantity: 2,
        description: "Product 1",
        "tax-rate": 6,
        price: 33.87,
      },
      {
        quantity: 4.1,
        description: "Product 2",
        "tax-rate": 6,
        price: 12.34,
      },
      {
        quantity: 4.5678,
        description: "Product 3",
        "tax-rate": 21,
        price: 6324.453456,
      },
    ],
    // The message you would like to display on the bottom of your invoice
    "bottom-notice": "Kindly pay your invoice within 15 days.",
    // Settings to customize your invoice
    settings: {
      currency: "CZK", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
      // "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')
      // "tax-notation": "gst", // Defaults to 'vat'
      // "margin-top": 25, // Defaults to '25'
      // "margin-right": 25, // Defaults to '25'
      // "margin-left": 25, // Defaults to '25'
      // "margin-bottom": 25, // Defaults to '25'
      // "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
      // "height": "1000px", // allowed units: mm, cm, in, px
      // "width": "500px", // allowed units: mm, cm, in, px
      // "orientation": "landscape", // portrait or landscape, defaults to portrait
    },
    // Translate your invoice to your preferred language
    translate: {
      invoice: "Faktura", // Default to 'INVOICE'
      number: "Číslo", // Defaults to 'Number'
      date: "Datum", // Default to 'Date'
      "due-date": "Datum splatnosti", // Defaults to 'Due Date'
      subtotal: "Součet", // Defaults to 'Subtotal'
      products: "Produkty", // Defaults to 'Products'
      quantity: "Počet", // Default to 'Quantity'
      price: "Cena", // Defaults to 'Price'
      "product-total": "Celkem", // Defaults to 'Total'
      total: "Celkem", // Defaults to 'Total'
    },
  };
  try {
    const result = await easyinvoice.createInvoice(data);
    // The response will contain a base64 encoded PDF file
    const params = {
      Bucket: "e-learning23",
      Key: `${nanoid()}.invoice.pdf`,
      Body: Buffer.from(result.pdf, "base64"),
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `application/pdf`,
    };
    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      res.send(data);
    });
  } catch (error) {
    console.log(error);
  }
};
export const register = async (req, res) => {
  try {
    console.log(req.body.password, req.body.passwordRepeat);
    if (req.body.password !== req.body.passwordRepeat) {
      return res.status(400).send({ message: "Passwords doesn´t match" });
    }
    if (!(req.body.email && req.body.password)) {
      return res
        .status(400)
        .send({ message: "Data are not formatted properly" });
    }
    const emailFromDatabase = await User.findOne({ email: req.body.email });
    if (emailFromDatabase) {
      return res.status(400).send({ message: "user exists" });
    }
    // creating a new mongoose doc from user data
    const user = new User(req.body);
    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    user.password = await bcrypt.hash(user.password, salt);
    const params = {
      Destination: {
        /* required */
        CcAddresses: [
          req.body.email,
          /* more CC email addresses */
        ],
        ToAddresses: [
          "pkaplan1@seznam.cz",
          /* more To email addresses */
        ],
      },
      Source: process.env.EMAIL_FROM /* required */,
      ReplyToAddresses: [process.env.EMAIL_FROM],
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
              <html>
              <h1>User Registered</h1>
              <p>Welcome to e-learning</p>
              </html>
            `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Welcome",
        },
      },
    };
    const emailSent = await client.sendEmail(params).promise();
    console.log(emailSent, "SENT");

    await user.save().then((doc) => res.status(201).send(doc));
    return;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    console.log("LOGIN FIRED");
    const body = req.body;
    const user = await User.findOne({ email: body.email });
    if (user == null) {
      res.json({ error: "User does not exist" });

      return res.status(201).end();
    }
    if (user) {
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (validPassword) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });
        res.cookie("token", token, {
          httpOnly: true,
        });
        res.cookie("user", user._id.toString(), {
          httpOnly: true,
        });
        user.password = undefined;
        console.log(user, "usrrr");
        res.status(200).json({ user });
      } else {
        return res.status(400).json({ error: "Invalid Password" });
      }
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("user");

    return res.status(201).send({ message: "user loged out" });
  } catch (error) {
    res.status(401).json({ error: "server error" });
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      return res.json({ ok: true });
    }
  } catch (error) {
    console.log(error);
  }
};
export const sendTestEmail = async (req, res) => {
  const params = {
    Destination: {
      /* required */
      CcAddresses: [
        "pkaplan1@seznam.cz",
        /* more CC email addresses */
      ],
      ToAddresses: [
        "pkaplan1@seznam.cz",
        /* more To email addresses */
      ],
    },
    Source: process.env.EMAIL_FROM /* required */,
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <html>
            <h1>Reset Pass</h1>
            <p>Use following link</p>

            </html>
          `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Reset password",
      },
    },
  };
  const emailSent = client.sendEmail(params).promise();
  emailSent
    .then(() => {
      res.json({ ok: true });
    })
    .catch((err) => {
      console.log(err);
    });
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    );
    if (!user) {
      return res.status(400).send("User not found");
    }
    const params = {
      Destination: {
        /* required */
        CcAddresses: [
          "pkaplan1@seznam.cz",
          /* more CC email addresses */
        ],
        ToAddresses: [
          email,
          /* more To email addresses */
        ],
      },
      Source: process.env.EMAIL_FROM /* required */,
      ReplyToAddresses: [process.env.EMAIL_FROM],
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
              <html>
              <h1>Reset Pass</h1>
              <p>Use following link</p>
                <h4>${shortCode}</h4>
              </html>
            `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Reset password",
        },
      },
    };
    const emailSent = client.sendEmail(params).promise();
    emailSent
      .then((data) => {
        res.json({ ok: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password, code } = req.body;
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    const newPassword = await bcrypt.hash(password, salt);
    const user = User.findOneAndUpdate(
      { email, passwordResetCode: code },
      {
        password: newPassword,
        passwordResetCode: "",
      }
    ).exec();

    res.json({ ok: true });
  } catch (err) {
    return res.status(400).send("error, try again");
  }
};
