var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
const path = require("path");
const cv = require("opencv4nodejs");
const fs = require("fs");
var formidable = require('formidable');
var mkdirp = require("mkdirp");

router.get('/', (req, res, next) => {
  res.send('Express RESTful API');

})

router.post('/signup', function (req, res) {
  console.log(req.body)
  if (!req.body.username || !req.body.password) {
    res.json({ success: false, msg: 'Please pass username and password.' });
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    newUser.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Username already exists.' });
      }
      res.json({ success: true, msg: 'Successful created new user.' });
    });
  }
});

router.post('/signin', function (req, res) {
  User.findOne({
    username: req.body.username
  }, function (err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret);
          // return the information including token as JSON


          console.log(req.body);
          let isIdentified = false;
          const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
          const getFaceImage = (grayImg) => {
            const faceRects = classifier.detectMultiScale(grayImg).objects;
            // console.log(faceRects)
            // if (!faceRects.length) {
            //   throw new Error('failed to detect faces');
            // }
            return grayImg;
          };
          let img = req.body.img._imageAsDataUrl;
          let username = req.body.username;
          let fileName = req.body.isRegconitionImg ? (username + "4") : username;
          // let fileDir = "../tscode/src/assets/images/" + username;
          let filePath = "../tscode/src/assets/images/face-recognition/imgs/" + fileName + ".jpeg";
          let data = img.replace(/^data:image\/\w+;base64,/, '');
          let isUserLogin = req.body.isUserLogin;

          // mkdirp(fileDir, (error) => {
          //   console.log(error)
          //   fs.writeFile(filePath, data, { encoding: 'base64' }, (err) => {
          //     return res.json({
          //       result: 'OK',
          //       error: err
          //     });
          //   })
          // });

          fs.writeFile(filePath, data, { encoding: 'base64' }, (err) => {
            const basePath = "../tscode/src/assets/images/face-recognition";
            const imgsPath = path.resolve(basePath, 'imgs');
            // const nameMappings = ['daryl', 'rick', 'negan'];
            const nameMappings = [`${username}`];
            const imgFiles = fs.readdirSync(imgsPath);

            const images = imgFiles
              // get absolute file path
              .map(file => path.resolve(imgsPath, file))
              // read image
              .map(filePath => cv.imread(filePath))
              // face recognizer works with gray scale images
              .map(img => img.bgrToGray())
              // detect and extract face
              .map(getFaceImage)
              // face images must be equally sized
              .map(faceImg => faceImg.resize(80, 80));

            const isImageFour = (_, i) => imgFiles[i].includes(`${username}4`);
            const isNotImageFour = (_, i) => !isImageFour(_, i);
            // use images 1 - 3 for training
            const trainImages = images.filter(isNotImageFour);
            // use images 4 for testing
            const testImages = images.filter(isImageFour);
            // make labels
            const labels = imgFiles
              .filter(isNotImageFour)
              .map(file => nameMappings.findIndex(name => file.includes(name)));


            const lbph = new cv.LBPHFaceRecognizer();
            lbph.train(trainImages, labels);

            const runPrediction = (recognizer) => {
              testImages.forEach((img) => {
                const result = recognizer.predict(img);
                console.log('predicted: %s, confidence: %s', nameMappings[result.label], result.confidence);
                if (nameMappings[result.label] === `${username}` && result.confidence >= 63) {
                  isIdentified = true;
                }
                cv.destroyAllWindows();

              });
              return isIdentified;
            };

            

            let result = runPrediction(lbph);
            return res.json({ success: result, token: 'JWT ' + token });

          })
        } else {
          return res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
        }
      });
    }
  });
});

router.post('/img/store', (req, res) => {
  let img = req.body.img._imageAsDataUrl;
  let username = req.body.username;
  let fileName = req.body.isRegconitionImg ? (username + "4") : username;
  // let fileDir = "../tscode/src/assets/images/" + username;
  let filePath = "../tscode/src/assets/images/face-recognition/imgs/" + fileName + ".jpeg";
  let data = img.replace(/^data:image\/\w+;base64,/, '');
  let isUserLogin = req.body.isUserLogin;

  // mkdirp(fileDir, (error) => {
  //   console.log(error)
  //   fs.writeFile(filePath, data, { encoding: 'base64' }, (err) => {
  //     return res.json({
  //       result: 'OK',
  //       error: err
  //     });
  //   })
  // });
  fs.writeFile(filePath, data, { encoding: 'base64' }, (err) => {
    return res.json({
      result: 'OK',
      error: err
    });
  })

})

// router.post("/cv", (req, res) => {
//   let isIdentified = false;
//   const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
//   const getFaceImage = (grayImg) => {
//     const faceRects = classifier.detectMultiScale(grayImg).objects;
//     // console.log(faceRects)
//     // if (!faceRects.length) {
//     //   throw new Error('failed to detect faces');
//     // }
//     return grayImg;
//   };

//   const basePath = "../tscode/src/assets/images/face-recognition";
//   const imgsPath = path.resolve(basePath, 'imgs');
//   // const nameMappings = ['daryl', 'rick', 'negan'];
//   const nameMappings = ['phuoc'];
//   const imgFiles = fs.readdirSync(imgsPath);

//   const images = imgFiles
//     // get absolute file path
//     .map(file => path.resolve(imgsPath, file))
//     // read image
//     .map(filePath => cv.imread(filePath))
//     // face recognizer works with gray scale images
//     .map(img => img.bgrToGray())
//     // detect and extract face
//     .map(getFaceImage)
//     // face images must be equally sized
//     .map(faceImg => faceImg.resize(80, 80));

//   const isImageFour = (_, i) => imgFiles[i].includes('4');
//   const isNotImageFour = (_, i) => !isImageFour(_, i);
//   // use images 1 - 3 for training
//   const trainImages = images.filter(isNotImageFour);
//   // use images 4 for testing
//   const testImages = images.filter(isImageFour);
//   // make labels
//   const labels = imgFiles
//     .filter(isNotImageFour)
//     .map(file => nameMappings.findIndex(name => file.includes(name)));


//   const lbph = new cv.LBPHFaceRecognizer();
//   lbph.train(trainImages, labels);

//   const runPrediction = (recognizer, cb) => {
//     testImages.forEach((img) => {
//       const result = recognizer.predict(img);
//       console.log('predicted: %s, confidence: %s', nameMappings[result.label], result.confidence);
//       if (nameMappings[result.label] === 'phuoc' && result.confidence >= 63) {
//         isIdentified = true;
//       }
//       cv.destroyAllWindows();

//     });
//     cb();
//   };

//   runPrediction(lbph, () => {
//     return res.json({
//       isUser: isIdentified
//     });
//   });
// });

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
module.exports = router;
