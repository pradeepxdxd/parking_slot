import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import crypto from "crypto";
import userModel from "../models/auth.model.js";
import slotModel from "../models/slots.model.js";
import bookingModel from "../models/booking.model.js";
import statisticsModel from "../models/statistics.model.js";

const saltRounds = process.env.SALT_ROUNDS;

export async function signUp(req, res) {
    try {
        const user = await userModel.findOne({ email: req.body.email });

        if (user) {
            res.status(202).send({
                statusCode: 202,
                err: "user already exist"
            })
        }
        else {
            const encryptedPassword = await bcrypt.hash(req.body.password, Number(saltRounds));
            const url = req.protocol + '://' + req.get('host') + '/Images/' + req.file.filename
            req.body = { ...req.body, profileImage: url, password: encryptedPassword }
            const userData = await userModel.create(req.body);
            console.log(userData);
            res.status(201).send({
                statusCode: 201,
                msg: "user registered successfully",
                userData
            })
        }
    }
    catch (err) {
        res.status(500).send({
            statusCode: 500,
            err: "Internal Server Error"
        })
    }
}

export async function signIn(req, res) {
    try {
        const user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            res.status(400).send({
                statusCode: 400,
                err: "user not found"
            })
        }
        else {
            const authorizedUser = await bcrypt.compare(req.body.password, user.password);

            if (authorizedUser) {
                const token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, { expiresIn: "2h" });
                res.status(200).send({
                    statusCode: 200,
                    msg: "user logged in successfully",
                    user,
                    token
                })
            }
            else {
                res.status(401).send({
                    statusCode: 401,
                    err: "incorrect email and password"
                })
            }
        }
    }
    catch (err) {
        res.status(500).send({
            statusCode: 500,
            err: "Internal Server Error"
        })
    }
}

export async function slotBooking(req, res) {
    try {
        const { from, to } = req.body;

        const booked = await bookingModel.create({ ...req.body, from : new Date(from), to : new Date(to), expireAt: new Date(to) });
        if (booked) {
            await statisticsModel.create({ time: from });
            res.status(201).send({
                statusCode: 201,
                msg: "slot booked",
            })
        }
        else {
            res.status(400).send({
                statusCode: 400,
                err: "something went wrong"
            })
        }
    }
    catch (err) {
        res.status(500).send({
            statusCode: 500,
            err: "Internal Server Error"
        })
    }
}

export async function fillAllSlots(req, res) {
    try {
        const data = await slotModel.insertMany(req.body);
        if (data) {
            res.status(201).send({
                statusCode: 201,
                msg: "data added successfully"
            })
        }
        else {
            res.status(400).send({
                statusCode: 400,
                msg: "something went wrong"
            })
        }
    }
    catch (err) {
        res.status(500).send({
            statusCode: 500,
            err: "Internal Server Error"
        })
    }
}

export async function getSlotByVehicleType(req, res) {
    try {
        const { type, from, to } = req.query;

        const covFrom = new Date(from);
        const covTo = new Date(to);

        if (type === '') {
            return res.status(400).send({
                statusCode: 400,
                err: "please select any fields"
            })
        }

        const bookedSlots = await bookingModel.find({
            type, from: {
                $gte: covFrom,
                // $lte: covTo
            }
        });

        if (bookedSlots.length !== 0) {
            const ids = [];

            bookedSlots?.map(item => {
                ids.push(item.slot_id);
            })

            const data = await slotModel.updateMany({
                _id: {
                    $in: ids
                }
            }, { $set: { booked: true } })

            if (data) {
                const result = await slotModel.find({ vehicle: type })
                res.status(200).send({
                    statusCode: 200,
                    result
                });
            }
        }

        else {
            await slotModel.updateMany({ vehicle: type }, { booked: false });
            const result = await slotModel.find({ vehicle: type })
            res.status(201).send({
                statusCode: 201,
                result
            })
        }
    }
    catch (err) {
        res.status(500).send({
            statusCode: 500,
            err: "Internal Server Error"
        })
    }

}

export async function getSlotInfo(req, res) {
    try {
        const info = await slotModel.findById(req.params.id);

        if (info) {
            res.status(200).send({
                statusCode: 200,
                msg: "data fetched successfully",
                info
            })
        }
        else {
            res.status(400).send({
                statusCode: 400,
                msg: "something went wrong",
                info
            })
        }
    }
    catch (err) {
        res.status(500).send({
            statusCode: 500,
            err: "Internal Server Error"
        })
    }
}

export async function postStats(req, res) {
    try {
        await statisticsModel.insertMany(req.body);
        res.send("data added successfully");
    }
    catch (err) {
        res.status(500).send("Internal Server Error")
    }
}

export async function getStatisticsByMonth(req, res) {
    try {
        const data = [];

        const statistic = await statisticsModel.aggregate([
            {
                $group: {
                    _id: { month: { $month: { $toDate: "$time" } }, year: { $year: { $toDate: "$time" } } },
                    bookings: { $sum: 1 }
                }
            }
        ])

        statistic?.map(item => {
            if (item._id.year == req.query.year) {
                data.push({
                    month: item._id.month,
                    booking: item.bookings
                })
            }
        })

        const result = [];
        const ans = data.sort((a, b) => a.month > b.month ? 1 : -1)

        ans.map(item => {
            result.push(item.booking)
        })

        res.send(result);

    }
    catch (err) {
        res.status(500).send({
            statusCode: 500,
            err: "Internal Server Error"
        })
    }
}

// create order
export async function orders(req, res) {
    try {
        const instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
        });

        const options = {
            amount: req.body.amount * 100,
            currency: 'INR',
        };

        instance.orders.create(options, (err, order) => {
            if (err) {
                return res.status(400).send({
                    statusCode: 400,
                    err: 'something went wrong',
                });
            } else {
                return res.status(200).send({
                    statusCode: 200,
                    data: order,
                });
            }
        });
    } catch (err) {
        res.status(500).send({
            statusCode: 500,
            err: 'Internal Server Error',
        });
    }
};

// payment verify
export async function verify(req, res) {
    try {
        let body =
            req.body.response.razorpay_order_id +
            '|' +
            req.body.response.razorpay_payment_id;

        var expectedSignature = crypto
            .createHmac('sha256', process.env.KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === req.body.response.razorpay_signature) {
            res.status(200).send({
                statusCode: 200,
                msg: 'Sign Valid',
            });
        } else {
            res.status(500).send({
                statusCode: 500,
                err: 'Sign Invalid',
            });
        }
    } catch (err) {
        res.status(500).send({
            statusCode: 500,
            err: 'Internal Server Error',
        });
    }
};

export async function paymentDetails(req, res) {
    try {
        const instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
        });

        await instance.payments.fetch(req.body.razorpay_payment_id).then(order => {
            res.status(200).json({
                success: true,
                data: order,
            });
        });
    } catch (err) {
        res.status(400).send({
            statusCode: '400',
            err: 'something went wrong',
        });
    }
};
