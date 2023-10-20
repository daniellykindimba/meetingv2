import {AuthBindings} from "@refinedev/core";

import {
  AuthActionResponse,
  CheckResponse,
  OnErrorResponse,
} from "@refinedev/core/dist/interfaces";
import {client, gqlDataProvider} from "./api";
import toast from "react-hot-toast";
import ApiService from "./utils/api_services";

export const authProvider: AuthBindings = {
  login: async ({email, password}): Promise<AuthActionResponse> => {
    const {data} = await new ApiService().login({email, password});
    if (data) {
      if (data.success === false) {
        toast.error("Invalid Credentials", {
          position: "top-center",
        });
        return {
          success: false,
        };
      }

      client.setHeader("Authorization", `Bearer ${data.token}`);
      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      // return Promise.resolve("/home");
      toast.success("Login Success", {
        position: "top-center",
      });
      return {
        success: true,
        redirectTo: "/home",
      };
    }
    return {
      success: false,
    };
  },
  logout: async (): Promise<AuthActionResponse> => {
    localStorage.clear();
    return Promise.resolve({success: true, redirectTo: "/login"});
  },
  getPermissions: () => Promise.resolve(["admin"]),
  getIdentity: async () => {
    const {data} = await new ApiService().getIdentity();
    if (data) {
      return Promise.resolve({
        id: data.id,
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        isStaff: data.isStaff,
        isAdmin: data.isAdmin,
      });
    }
    return Promise.reject();
  },
  check: function (params?: any): Promise<CheckResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.resolve({
        redirectTo: "/login",
        success: false,
        authenticated: false,
      });
    }
    return Promise.resolve({
      redirectTo: "/home",
      success: true,
      authenticated: true,
    });
  },
  onError: function (error: any): Promise<OnErrorResponse> {
    return Promise.resolve({redirectTo: "/login", success: false});
  },
  forgotPassword: async ({email}): Promise<AuthActionResponse> => {
    // persist the email in the local storage
    localStorage.setItem("recover_email", email);
    const {data} = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      meta: {
        operation: "forgotPassword",
        variables: {
          email: {
            value: email.trim(),
            type: "String",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log("error", error);
        return {
          data: null,
        };
      })
      .then((data: any) => {
        return data;
      });

    if (data) {
      if (data.success === false) {
        return {
          success: false,
        };
      }
      return {
        success: true,
        redirectTo: "/verify-otp",
      };
    }
    return {
      success: false,
    };
  },
  updatePassword: async ({
    password,
    confirmPassword,
  }): Promise<AuthActionResponse> => {
    console.log("password", password);
    console.log("confirmPassword", confirmPassword);
    // return Promise.resolve({success: true, redirectTo: "/login"});

    const {data} = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      meta: {
        operation: "userChangePassword",
        variables: {
          password: {
            value: password.trim(),
            type: "String",
            required: true,
          },
          confirmPassword: {
            value: confirmPassword.trim(),
            type: "String",
            required: true,
          },
          email: {
            value: localStorage.getItem("recover_email"),
            type: "String",
            required: true,
          },
          otp: {
            value: localStorage.getItem("recover_otp"),
            type: "String",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.error(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });

    if (data) {
      if (data.success) {
        return {
          success: true,
          redirectTo: "/login",
        };
      }
    }
    return Promise.reject({success: false});
  },
};
