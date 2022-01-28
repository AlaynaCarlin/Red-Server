const jwt = require("jsonwebtoken"); // import the jwt package
const { models } = require("../models"); // import the user model 

const validateJWT = async (req, res, next) => { //declare an asynchronous fat arrow function that calls validateJWT and takes 3 params
  if (req.method == "OPTIONS") {//! conditional that checks the method (POST, GET, etc) determines if the request is safe to send
    next(); // if it is a preflight request it is passed to the 3rd param (blue modules 12.2.1" This asynchronous function is a middleware function and it is a part of express. Req, res, and next are parameters that can only be accessed by express middleware functions. next() is a nested middleware function that, when called, passes control to the next middleware function.")
  } else if (//! if it is POST, GET, PUT, or DELETE
    req.headers.authorization && //we want to see of there is data in an authorization header
    req.headers.authorization.includes("Bearer") // and if that string includes the word bearer
  ) {
    const { authorization } = req.headers; // pulls the authorization header and sets it to a variable 
    // console.log("authorization -->", authorization);
    const payload = authorization // ternary that checks if authorization has a truthy value
      ? jwt.verify(  //! if authorization is truthy, we call the jwt verify method (`jwt.verify(token, secretOrPublicKey, [options, callback])`)
        authorization.includes("Bearer") //? first param in verify method
          ? authorization.split(" ")[1] //* ternary, if the authorization includes the word bearer we return just the token and cut out the word bearer
          : authorization, //* otherwise just return the token
        process.env.JWT_SECRET //? second param in verify method
      ) //!
      : undefined; // if authorization is falsy, payload will receive a value of undefined
    //  console.log("payload -->", payload);
    if (payload) { //? a conditional that will check for a truthy value in payload (payload) = if (payload = true)
      let foundUser = await models.UsersModel.findOne({ where: { id: payload.id } }); // uses the findOne method to find the user with the matching id and stores it to foundUser
      //   console.log("foundUser -->", foundUser);
      if (foundUser) { //* if foundUser has a truthy value
        // console.log("request -->", req);
        req.user = foundUser; // if we found the user in the database, we create a new property called user which now holds the info in foundUser
        next(); //exits us out of this function. passes us to the next middleware function?
      } else { //* if it can't find the user in the database
        res.status(400).send({ message: "Not Authorized" }); // sends message
      }
    } else { //? if payload comes as a falsy value
      res.status(401).send({ message: "Invalid token" }); // sends message
    }
  } else { //! if there is no authorization header or it doesn't have the word bearer 
    res.status(403).send({ message: "Forbidden" }); // sends message
  }
};

module.exports = validateJWT;