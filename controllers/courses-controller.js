const Course = require("./../models/course-model");
const { validationResult } = require("express-validator");
const httpStatusText = require("./../utils/httpStatusText");
const asyncHandler = require("express-async-handler");

const appError=require('./../utils/appError');

const getAllCourses = asyncHandler(async (req, res,next) => {

    const query = req.query;
    // console.log("query",query);

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip=(page-1)*limit;
    
    const courses = await Course.find({},{"__v":false}).limit(limit).skip(skip);
    res.json({
        status: httpStatusText.SUCCESS,
        data: {
        courses: courses,
        },
    });
}) ;

const getOneCourse =asyncHandler(  async (req, res,next) => {

        const courseId = req.params.courseId;
        const course = await Course.findById(courseId);
        
        if(!course){
            const error= appError.create("course not found",404, httpStatusText.FAIL);
            return next(error);
        }
        else{
        res.json({
                status: httpStatusText.SUCCESS,
                data: {
                    course: course,
                },
            });
        }
        
        // !course
        //     ? res.status(404).json({
        //         status: httpStatusText.FAIL,
        //         data: "course not found",
        //     })
        //     : res.json({
        //         status: httpStatusText.SUCCESS,
        //         data: {
        //             course: course,
        //         },
        //     });
// catch (error) {
//         res.status(400).json({
//             status: httpStatusText.ERROR,
//             data: null,
//             message: error.message,
//             code: 400,
//         });
//     }
}

)

const postCourse =asyncHandler( async (req, res,next) => {

    // console.log("body",{...req.body});

        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            const error= appError.create(errors.array(),400, httpStatusText.FAIL)
            return next(error);

            // return res.status(400).json({
            // status: httpStatusText.FAIL,
            // data: errors.array(),
            // });
        } else {
            const newCourse = new Course(req.body);
            await newCourse.save();
            res.json({
            status: httpStatusText.SUCCESS,
            data: { course: newCourse },
            });
        }
    }
)

const updateCourse = asyncHandler(async (req, res,next) => {
    const courseId = req.params.courseId;
    
        let updatedCourse = await Course.updateOne(
            { _id: courseId },
            { $set: { ...req.body } }
        );
        if (!updatedCourse) {
            const error= appError.create("course not found",400, httpStatusText.FAIL);
            return next(error);
            // return res.status(400).json({
            // status: httpStatusText.FAIL,
            // data: "course not found",
            // });
        }
        res.json({
            status: httpStatusText.SUCCESS,
            data: updatedCourse,
        })
    }

)

    const deleteCourse =asyncHandler( async (req, res,next) => {
            const courseId = req.params.courseId;
            const deletedCourse = await Course.deleteOne({ _id: courseId });
            res.json({
                status: httpStatusText.SUCCESS,
                data: null,
            });
        }
    )

    module.exports = {
        getAllCourses,
        getOneCourse,
        postCourse,
        updateCourse,
        deleteCourse,
    };
