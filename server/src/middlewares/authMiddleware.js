import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv/config";

const authMiddleHandler = (req, res, next) => {
  const userHeader = req.headers.authorization || req.headers.Authorization;
  if (!userHeader)
    return res.status(401).json({ message: "invalid jwt token" });
  
  const token = userHeader.split(" ")[1];
 
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) return res.status(403).json({ message: "invalid token" });
    req.user = decoded;
    console.log(req.user)
    next();
  });
};

export default authMiddleHandler;
