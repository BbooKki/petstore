import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";

const memberService = new MemberService();

const restaurantController: T = {};

restaurantController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.render("home"); //views folderdan file izlaydi
  } catch (err) {
    console.log("Error, goHome: ", err);
    res.redirect("/admin");
  }
};

restaurantController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("getSignup");
    res.render("signup");
    //send | json | redirect | end | render
  } catch (err) {
    console.log("Error, getSignup: ", err);
    res.redirect("/admin");
  }
};

restaurantController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.render("login");
  } catch (err) {
    console.log("Error, getLogin: ", err);
    res.redirect("/admin");
  }
};

restaurantController.processSignup = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("processSignup");
    const file = req.file;
    if (!file)
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

    const newMember: MemberInput = req.body;
    newMember.memberImage = file?.path.replace(/\\/g, "/");
    newMember.memberType = MemberType.STORE;

    const result = await memberService.processSignup(newMember);

    //SESSIONS AUTHENTICATION

    req.session.member = result; // browser/postmanga cookie'mizga borib seed joylab keladi va
    req.session.save(function () {
      // session collectionimizga result datani joylaydi va save bo'lgach response beradi
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, processSignup: ", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/signup') </script>`
    );
  }
};

restaurantController.processLogin = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("processLogin"); //Login Step 1

    const input: LoginInput = req.body; //Step 2
    const result = await memberService.processLogin(input); //Step 3

    //session
    req.session.member = result; // browser/postmanga borib coookiga seed joylab keladi va
    req.session.save(function () {
      // session collectionimizga result datani joylaydi va save bo'lgach response beradi
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, processLogin: ", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/login') </script>`
    );
  }
};

restaurantController.logout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("logout"); //Login Step 1

    req.session.destroy(function () {
      res.redirect("/admin"); //Databasedago sessionni o'chiradi
    });
  } catch (err) {
    console.log("Error, processLogin: ", err);
    res.redirect("/admin");
  }
};

restaurantController.getUsers = async (req: Request, res: Response) => {
  try {
    console.log("getUsers");
    const result = await memberService.getUsers();

    res.render("users", { users: result });
  } catch (err) {
    console.log("Error, getUsers: ", err);
    res.redirect("/admin/login");
  }
};

restaurantController.updateChosenUser = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenUser");
    const result = await memberService.updateChosenUser(req.body);

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateChosenUser ", err);

    console.log("Error, signup: ", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

restaurantController.updateChosenProduct = (req: Request, res: Response) => {
  try {
    console.log("updateChosenProduct");
    res.render("login");
  } catch (err) {
    console.log("Error, updateChosenProduct: ", err);
  }
};

restaurantController.checkAuthSession = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("checkAuthSession"); //Login Step 1

    if (req.session?.member)
      // ? => agar session bo'lsa
      res.send(`<script> alert("${req.session.member.memberNick}")</script>`);
    else res.send(`<script> alert("${Message.NOT_AUTHENTICATED}")</script>`);
  } catch (err) {
    console.log("Error, checkAuthSession: ", err);
    res.send(err);
  }
};

restaurantController.verifyStore = (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.session?.member?.memberType === MemberType.STORE) {
    req.member = req.session.member;
    next();
  } else {
    const message = Message.NOT_AUTHENTICATED;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/login');</script>`
    );
  }
};

export default restaurantController;
