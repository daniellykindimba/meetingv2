import toast from "react-hot-toast";
import {gqlDataProvider} from "../api";

class ApiService {
  async login({email, password}: {email: string; password: string}) {
    const data = await gqlDataProvider
      .custom({
        url: "",
        method: "post",
        metaData: {
          operation: "auth",
          variables: {
            email: {
              value: email.trim(),
              type: "String",
              required: true,
            },
            password: {value: password, type: "String", required: true},
          },
          fields: [
            "success",
            "message",
            "token",
            {
              user: [
                "id",
                "email",
                "phone",
                "firstName",
                "middleName",
                "lastName",
                "isStaff",
                "isAdmin",
                "isActive",
                "canEdit",
                "canDelete",
                "canManage",
              ],
            },
          ],
        },
      })
      .catch((error: any) => {
        console.log("error", error);
        toast.error("Something Went wrong", {
          position: "top-center",
        });
        return {
          data: null,
        };
      })
      .then((data: any) => {
        return data;
      });

    return data;
  }

  async getIdentity() {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "me",
        variables: {},
        fields: [
          "id",
          "firstName",
          "middleName",
          "lastName",
          "email",
          "phone",
          "isStaff",
          "isAdmin",
          "canEdit",
          "canDelete",
          "canManage",
        ],
      },
    })
      .catch((error: any) => {
        localStorage.setItem("need_auth", "1");
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async getUsers(page = 1, limit = 25, searchKey = "") {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "users",
        variables: {
          page: {
            value: page,
            type: "Int",
            required: false,
          },
          pageSize: {
            value: limit,
            type: "Int",
            required: false,
          },
          key: {
            value: searchKey,
            type: "String",
            required: false,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "firstName",
              "middleName",
              "lastName",
              "email",
              "phone",
              "isAdmin",
              "isStaff",
              "avatar",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {
          data: null,
        };
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async deleteUser(id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "delete",
      metaData: {
        operation: "deleteUser",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        return {
          data: null,
        };
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async blockUser(id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "blockUser",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        return {
          data: null,
        };
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async UnblockUser(id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "unblockUser",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        return {
          data: null,
        };
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async getVenues(page = 1, limit = 25, searchKey = "") {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "venues",
        variables: {
          page: {
            value: page,
            type: "Int",
            required: false,
          },
          pageSize: {
            value: limit,
            type: "Int",
            required: false,
          },
          key: {
            value: searchKey,
            type: "String",
            required: false,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "name",
              "capacity",
              "venueType",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {
          data: null,
        };
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async deleteVenue(id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "delete",
      metaData: {
        operation: "deleteVenue",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        return {
          data: null,
        };
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async blockVenue(id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "blockVenue",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        return {
          data: null,
        };
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async unblockVenue(id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "unblockVenue",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        return {
          data: null,
        };
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async getVenueTypes() {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "venueTypes",
        variables: {},
        fields: ["data"],
      },
    })
      .catch((error: any) => {
        return {
          data: null,
        };
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async createVenue(
    name: string,
    capacity: number,
    venue_type: string,
    description: string
  ) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "createVenue",
        variables: {
          name: {
            value: name,
            type: "String",
            required: true,
          },
          capacity: {
            value: capacity,
            type: "Int",
            required: true,
          },
          venueType: {
            value: venue_type,
            type: "String",
            required: true,
          },
          description: {
            value: description,
            type: "String",
            required: false,
          },
        },
        fields: [
          "success",
          "message",
          {
            venue: [
              "id",
              "name",
              "capacity",
              "venueType",
              "description",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async updateVenue(
    id: number,
    name: string,
    capacity: number,
    venue_type: string,
    description: string
  ) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "updateVenue",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
          name: {
            value: name,
            type: "String",
            required: true,
          },
          capacity: {
            value: capacity,
            type: "Int",
            required: true,
          },
          venueType: {
            value: venue_type,
            type: "String",
            required: true,
          },
          description: {
            value: description,
            type: "String",
            required: false,
          },
        },
        fields: [
          "success",
          "message",
          {
            venue: [
              "id",
              "name",
              "capacity",
              "venueType",
              "description",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {
          data: null,
        };
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  getCommittees = async (page = 1, limit = 25, searchKey = "") => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "committees",
        variables: {
          page: {
            value: page,
            type: "Int",
            required: false,
          },
          pageSize: {
            value: limit,
            type: "Int",
            required: false,
          },
          key: {
            value: searchKey,
            type: "String",
            required: false,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "name",
              "description",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {
          data: null,
        };
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  };

  async deleteCommittee(id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "delete",
      metaData: {
        operation: "deleteCommittee",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async blockCommittee(id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "blockCommittee",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async unblockCommittee(id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "unblockCommittee",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async createCommittee(name: string, description: string) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "createCommittee",
        variables: {
          name: {
            value: name,
            type: "String",
            required: true,
          },
          description: {
            value: description,
            type: "String",
            required: true,
          },
        },
        fields: [
          "success",
          "message",
          {
            committee: [
              "id",
              "name",
              "description",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async updateCommittee(id: number, name: string, description: string) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "updateCommittee",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
          name: {
            value: name,
            type: "String",
            required: true,
          },
          description: {
            value: description,
            type: "String",
            required: true,
          },
        },
        fields: [
          "success",
          "message",
          {
            committee: [
              "id",
              "name",
              "description",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async getDirectorates(page = 1, limit = 25, searchKey = "") {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "departments",
        variables: {
          page: {
            value: page,
            type: "Int",
            required: false,
          },
          pageSize: {
            value: limit,
            type: "Int",
            required: false,
          },
          key: {
            value: searchKey,
            type: "String",
            required: false,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "name",
              "description",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async deleteDirectorate(id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "delete",
      metaData: {
        operation: "deleteDepartment",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async blockDirectorate(id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "blockDepartment",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async unblockDirectorate(id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "unblockDepartment",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async createDirectorate(name: string, description: string) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "createDepartment",
        variables: {
          name: {
            value: name,
            type: "String",
            required: true,
          },
          description: {
            value: description,
            type: "String",
            required: true,
          },
        },
        fields: [
          "success",
          "message",
          {
            department: [
              "id",
              "name",
              "description",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })

      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async updateDirectorate(id: number, name: string, description: string) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "updateDepartment",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
          name: {
            value: name,
            type: "String",
            required: true,
          },
          description: {
            value: description,
            type: "String",
            required: true,
          },
        },
        fields: [
          "success",
          "message",
          {
            department: [
              "id",
              "name",
              "description",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })

      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async getMeetings(page = 1, limit = 25, searchKey = "", eventType = "") {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "events",
        variables: {
          page: {
            value: page,
            type: "Int",
            required: false,
          },
          pageSize: {
            value: limit,
            type: "Int",
            required: false,
          },
          key: {
            value: searchKey,
            type: "String",
            required: false,
          },
          eventType: {
            value: eventType,
            type: "String",
            required: false,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "title",
              "description",
              "eventType",
              "eventTypeValue",
              "startTime",
              "endTime",
              "created",
              "updated",
              "isActive",
              {
                venue: [
                  "id",
                  "name",
                  "capacity",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
              {
                author: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
              {
                attendees: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })

      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async deleteMeeting(id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "deleteEvent",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async blockMeeting(id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "blockEvent",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: [
          "success",
          "message",
          {
            event: [
              "id",
              "title",
              "description",
              "eventType",
              "eventTypeValue",
              "startTime",
              "endTime",
              "created",
              "updated",
              "isActive",
              {
                venue: ["id", "name", "capacity"],
              },
              {
                author: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                ],
              },
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async unblockMeeting(id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "unblockEvent",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: [
          "success",
          "message",
          {
            event: [
              "id",
              "title",
              "description",
              "eventType",
              "eventTypeValue",
              "startTime",
              "endTime",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
              {
                venue: [
                  "id",
                  "name",
                  "capacity",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
              {
                author: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async createMeeting(formData: FormData) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "createEvent",
        variables: {
          title: {
            value: formData.get("title"),
            type: "String",
            required: true,
          },
          description: {
            value: formData.get("description"),
            type: "String",
            required: true,
          },
          eventType: {
            value: formData.get("event_type"),
            type: "String",
            required: true,
          },
          startTime: {
            value: formData.get("start_time"),
            type: "String",
            required: true,
          },
          endTime: {
            value: formData.get("end_time"),
            type: "String",
            required: true,
          },
          venueId: {
            value: parseInt(String(formData.get("venue") ?? "0")),
            type: "Int",
            required: true,
          },
          financialYear: {
            value: formData.get("financial_year"),
            type: "String",
            required: true,
          },
          duration: {
            value: parseInt(String(formData.get("duration")) ?? "0"),
            type: "Int",
            required: true,
          },
          durationType: {
            value: formData.get("duration_type"),
            type: "String",
            required: true,
          },
          departments: {
            value: formData.get("departments") ?? [],
            type: "[Int]",
            required: false,
          },
          committees: {
            value: formData.get("committees") ?? [],
            type: "[Int]",
            required: false,
          },
        },
        fields: [
          "success",
          "message",
          {
            event: [
              "id",
              "title",
              "description",
              "eventType",
              "eventTypeValue",
              "startTime",
              "endTime",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
              {
                venue: [
                  "id",
                  "name",
                  "capacity",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
              {
                author: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
              {
                attendees: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async updateMeeting(id: number, formData: FormData) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "updateEvent",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
          title: {
            value: formData.get("title"),
            type: "String",
            required: true,
          },
          description: {
            value: formData.get("description"),
            type: "String",
            required: true,
          },
          eventType: {
            value: formData.get("eventType"),
            type: "String",
            required: true,
          },
          startTime: {
            value: formData.get("startTime"),
            type: "String",
            required: true,
          },
          endTime: {
            value: formData.get("endTime"),
            type: "String",
            required: true,
          },
          venueId: {
            value: formData.get("venueId"),
            type: "Int",
            required: true,
          },
        },
        fields: [
          "success",
          "message",
          {
            event: [
              "id",
              "title",
              "description",
              "eventType",
              "eventTypeValue",
              "startTime",
              "endTime",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
              {
                venue: [
                  "id",
                  "name",
                  "capacity",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
              {
                author: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {
          data: null,
        };
      })
      .then((data: any) => {
        console.log(data);
        return data;
      });
    return data;
  }

  async getEventAttendeesToAdd(
    eventId: number,
    page = 1,
    pageSize = 25,
    searchKey = ""
  ) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "eventAttendeesToAdd",
        variables: {
          eventId: {
            value: eventId,
            type: "Int",
            required: true,
          },
          page: {
            value: page,
            type: "Int",
            required: false,
          },
          pageSize: {
            value: pageSize,
            type: "Int",
            required: false,
          },
          key: {
            value: searchKey,
            type: "String",
            required: false,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "firstName",
              "middleName",
              "lastName",
              "email",
              "phone",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async getEventAttendees(id: number, page = 1, pageSize = 25, searchKey = "") {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "eventAttendees",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
          page: {
            value: page,
            type: "Int",
            required: false,
          },
          pageSize: {
            value: pageSize,
            type: "Int",
            required: false,
          },
          key: {
            value: searchKey,
            type: "String",
            required: false,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "created",
              "updated",
              "isActive",
              "isAttending",
              "canEdit",
              "canDelete",
              "canManage",
              {
                event: ["id", "title", "canEdit", "canDelete", "canManage"],
              },
              {
                attendee: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "created",
                  "updated",
                  "isActive",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async addMeetingAttendee(event_id: number, attendee_id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "addEventAttendee",
        variables: {
          eventId: {
            value: event_id,
            type: "Int",
            required: true,
          },
          attendeeId: {
            value: attendee_id,
            type: "Int",
            required: true,
          },
        },
        fields: [
          "success",
          "message",
          {
            eventAttendee: [
              "id",
              "created",
              "updated",
              "isActive",
              "isAttending",
              "canEdit",
              "canDelete",
              "canManage",
              {
                event: ["id", "title", "canEdit", "canDelete", "canManage"],
              },
              {
                attendee: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "created",
                  "updated",
                  "isActive",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async removeMeetingAttendee(event_id: number, attendee_id: number) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "removeEventAttendee",
        variables: {
          eventId: {
            value: event_id,
            type: "Int",
            required: true,
          },
          attendeeId: {
            value: attendee_id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async getMyTodaysEvents(page = 1, pageSize = 25, searchKey = "") {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "myTodaysEvents",
        variables: {
          page: {
            value: page,
            type: "Int",
            required: false,
          },
          pageSize: {
            value: pageSize,
            type: "Int",
            required: false,
          },
          key: {
            value: searchKey,
            type: "String",
            required: false,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "title",
              "description",
              "eventType",
              "eventTypeValue",
              "startTime",
              "endTime",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
              "manageDocuments",
              "manageAgendas",
              "manageMinutes",
              {
                venue: [
                  "id",
                  "name",
                  "capacity",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
              {
                author: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
              {
                attendees: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async getEventDocumentsManagers(
    id: number,
    page = 1,
    pageSize = 25,
    searchKey = ""
  ) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "eventDocumentsManagers",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
          page: {
            value: page,
            type: "Int",
            required: false,
          },
          pageSize: {
            value: pageSize,
            type: "Int",
            required: false,
          },
          key: {
            value: searchKey,
            type: "String",
            required: false,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "created",
              "updated",
              "isActive",
              "isAttending",
              "canEdit",
              "canDelete",
              "canManage",
              {
                event: [
                  "id",
                  "title",
                  "canEdit",
                  "canDelete",
                  "canManage",
                  "manageDocuments",
                  "manageAgendas",
                  "manageMinutes",
                ],
              },
              {
                attendee: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "created",
                  "updated",
                  "isActive",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async getEventAgendasManagers(
    id: number,
    page = 1,
    pageSize = 25,
    searchKey = ""
  ) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "eventAgendasManagers",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
          page: {
            value: page,
            type: "Int",
            required: false,
          },
          pageSize: {
            value: pageSize,
            type: "Int",
            required: false,
          },
          key: {
            value: searchKey,
            type: "String",
            required: false,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "created",
              "updated",
              "isActive",
              "isAttending",
              "canEdit",
              "canDelete",
              "canManage",
              {
                event: [
                  "id",
                  "title",
                  "canEdit",
                  "canDelete",
                  "canManage",
                  "manageDocuments",
                  "manageAgendas",
                  "manageMinutes",
                ],
              },
              {
                attendee: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "created",
                  "updated",
                  "isActive",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async getEventMinutesManagers(
    id: number,
    page = 1,
    pageSize = 25,
    searchKey = ""
  ) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "eventMinutesManagers",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
          page: {
            value: page,
            type: "Int",
            required: false,
          },
          pageSize: {
            value: pageSize,
            type: "Int",
            required: false,
          },
          key: {
            value: searchKey,
            type: "String",
            required: false,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "created",
              "updated",
              "isActive",
              "isAttending",
              "canEdit",
              "canDelete",
              "canManage",
              {
                event: [
                  "id",
                  "title",
                  "canEdit",
                  "canDelete",
                  "canManage",
                  "manageDocuments",
                  "manageAgendas",
                  "manageMinutes",
                ],
              },
              {
                attendee: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "created",
                  "updated",
                  "isActive",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async getCreationFinancialYears() {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "creationFinancialYears",
        variables: {},
        fields: ["data"],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async getFinancialYears() {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "financialYears",
        variables: {},
        fields: ["data"],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  async getMyMeetings({
    page = 1,
    pageSize = 25,
    searchKey = "",
    eventType = "others",
    financialYear = "",
    committeeId = 0,
    departmentId = 0,
  }) {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "myEvents",
        variables: {
          page: {
            value: page,
            type: "Int",
            required: false,
          },
          pageSize: {
            value: pageSize,
            type: "Int",
            required: false,
          },
          key: {
            value: searchKey,
            type: "String",
            required: false,
          },
          eventType: {
            value: eventType,
            type: "String",
            required: false,
          },
          financialYear: {
            value: financialYear,
            type: "String",
            required: false,
          },
          committeeId: {
            value: committeeId ?? 0,
            tyep: "Int",
            required: false,
          },
          departmentId: {
            value: departmentId ?? 0,
            tyep: "Int",
            required: false,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "title",
              "description",
              "eventType",
              "eventTypeValue",
              "startTime",
              "endTime",
              "quarter",
              "financialYear",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
              "manageDocuments",
              "manageAgendas",
              "manageMinutes",
              {
                venue: [
                  "id",
                  "name",
                  "capacity",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
              {
                author: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
              {
                attendees: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  }

  getMeeting = async (id: number) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "event",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: [
          "id",
          "title",
          "description",
          "eventType",
          "eventTypeValue",
          "startTime",
          "endTime",
          "created",
          "updated",
          "isActive",
          "canEdit",
          "canDelete",
          "canManage",
          "manageDocuments",
          "manageAgendas",
          "manageMinutes",
          {
            venue: [
              "id",
              "name",
              "capacity",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
          {
            author: [
              "id",
              "firstName",
              "middleName",
              "lastName",
              "email",
              "phone",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
          {
            attendees: [
              "id",
              "firstName",
              "middleName",
              "lastName",
              "email",
              "phone",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  getMeeteingDocuments = async (id: number) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "eventDocuments",
        variables: {
          eventId: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "title",
              "description",
              "file",
              "canEdit",
              "canDelete",
              "canManage",
              {
                event: [
                  "id",
                  "canEdit",
                  "canDelete",
                  "canManage",
                  "manageDocuments",
                  "manageAgendas",
                  "manageMinutes",
                ],
              },
              {
                author: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
              {
                note: [
                  "id",
                  "note",
                  "created",
                  "updated",
                  "isActive",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
              {
                departments: [
                  "id",
                  "name",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  createMeetingDocument = async (formData: FormData) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "createEventDocument",
        variables: {
          eventId: {
            value: parseInt(formData.get("event_id")?.toString() ?? "0"),
            type: "Int",
            required: true,
          },
          title: {
            value: formData.get("title"),
            type: "String",
            required: true,
          },
          description: {
            value: formData.get("description"),
            type: "String",
            required: false,
          },
          departmentId: {
            value: parseInt(formData.get("department_id")?.toString() ?? "0"),
            type: "Int",
            required: false,
          },
          file: {
            value: formData.get("document"),
            type: "Upload",
            required: true,
          },
        },
        fields: [
          "success",
          "message",
          {
            eventDocument: [
              "id",
              "title",
              "description",
              "file",
              "canEdit",
              "canDelete",
              "canManage",
              {
                event: [
                  "id",
                  "canEdit",
                  "canDelete",
                  "canManage",
                  "manageDocuments",
                  "manageAgendas",
                  "manageMinutes",
                ],
              },
              {
                author: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
              {
                note: [
                  "id",
                  "note",
                  "created",
                  "updated",
                  "isActive",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
              {
                departments: [
                  "id",
                  "name",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  createDocumentUserNote = async (document_id: number, note: string) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "createDocumentUserNote",
        variables: {
          documentId: {
            value: document_id,
            type: "Int",
            required: true,
          },
          note: {
            value: note,
            type: "String",
            required: true,
          },
        },
        fields: [
          "success",
          "message",
          {
            eventDocumentNote: [
              "id",
              "note",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
              {
                eventDocument: [
                  "id",
                  "title",
                  "description",
                  "file",
                  "canEdit",
                  "canDelete",
                  "canManage",
                  {
                    event: [
                      "id",
                      "canEdit",
                      "canDelete",
                      "canManage",
                      "manageDocuments",
                      "manageAgendas",
                      "manageMinutes",
                    ],
                  },
                  {
                    author: [
                      "id",
                      "firstName",
                      "middleName",
                      "lastName",
                      "email",
                      "phone",
                      "canEdit",
                      "canDelete",
                      "canManage",
                    ],
                  },
                  {
                    note: [
                      "id",
                      "note",
                      "created",
                      "updated",
                      "isActive",
                      "canEdit",
                      "canDelete",
                      "canManage",
                    ],
                  },
                  {
                    departments: [
                      "id",
                      "name",
                      "canEdit",
                      "canDelete",
                      "canManage",
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  getUserEventDocumentNote = async (document_id: number) => {
    // user_event_document_note
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "userEventDocumentNote",
        variables: {
          id: {
            value: document_id,
            type: "Int",
            required: true,
          },
        },
        fields: [
          "id",
          "note",
          "created",
          "updated",
          "isActive",
          "canEdit",
          "canDelete",
          "canManage",
        ],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  deleteEventDocument = async (id: number) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "deleteEventDocument",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  getMeetingAgendas = async (id: number, key = "") => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "eventAgendas",
        variables: {
          eventId: {
            value: id,
            type: "Int",
            required: true,
          },
          key: {
            value: key,
            type: "String",
            required: false,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "title",
              "description",
              "index",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  getMeetingMinutes = async (id: number) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "eventMinutes",
        variables: {
          eventId: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "content",
              "index",
              "canEdit",
              "canDelete",
              "canManage",
              {
                author: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                ],
              },
              {
                event: ["id"],
              },
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  createMeetingAgenda = async (meeting_id: number, content: string) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "createEventAgenda",
        variables: {
          eventId: {
            value: meeting_id,
            type: "Int",
            required: true,
          },
          title: {
            value: content,
            type: "String",
            required: true,
          },
        },
        fields: [
          "success",
          "message",
          {
            eventAgenda: [
              "id",
              "title",
              "description",
              "created",
              "updated",
              "isActive",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  deleteMeetingAgenda = async (id: number) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "deleteEventAgenda",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  deleteMeetingMinute = async (id: number) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "deleteEventMinute",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  createMeetingMinute = async (meeting_id: number, content: string) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "createEventMinute",
        variables: {
          eventId: {
            value: meeting_id,
            type: "Int",
            required: true,
          },
          content: {
            value: content,
            type: "String",
            required: true,
          },
        },
        fields: [
          "success",
          "message",
          {
            eventMinute: [
              "id",
              "content",
              "index",
              "canEdit",
              "canDelete",
              "canManage",
              {
                author: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                ],
              },
              {
                event: ["id"],
              },
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  getEventTypes = async () => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "eventTypes",
        variables: {},
        fields: ["data"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  sendMeetingInvitationSMSAllAttendees = async (meeting_id: number) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "sendMeetingInvitationSmsAllAttendees",
        variables: {
          eventId: {
            value: meeting_id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  // send_meeting_invitation_attendee
  sendMeetingInvitationSMSAttendee = async (
    meeting_id: number,
    attendee_id: number
  ) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "sendMeetingInvitationAttendee",
        variables: {
          eventId: {
            value: meeting_id,
            type: "Int",
            required: true,
          },
          attendeeId: {
            value: attendee_id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  createUserCredentials = async (user_id: number) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "createUserCredentials",
        variables: {
          userId: {
            value: user_id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  removeMeetingCommittee = async (meeting_id: number, committee_id: number) => {
    console.log(meeting_id, committee_id);
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "deleteEventCommittee",
        variables: {
          eventId: {
            value: meeting_id,
            type: "Int",
            required: true,
          },
          committeeId: {
            value: committee_id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  getMeetingCommittees = async (meeting_id: number, key = "") => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "eventCommittees",
        variables: {
          id: {
            value: meeting_id,
            type: "Int",
            required: true,
          },
          key: {
            value: key,
            type: "String",
            required: false,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              {
                committee: ["id", "name", "description"],
              },
              "canEdit",
              "canDelete",
              "canManage",
              "isActive",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  getMeetingCommitteesToAdd = async (meeting_id: number, key = "") => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "eventCommitteesToAdd",
        variables: {
          id: {
            value: meeting_id,
            type: "Int",
            required: true,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "name",
              "description",
              "created",
              "updated",
              "canEdit",
              "canDelete",
              "canManage",
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  addMeetingCommittee = async (meeting_id: number, committee_id: number) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "addEventCommittee",
        variables: {
          eventId: {
            value: meeting_id,
            type: "Int",
            required: true,
          },
          committeeId: {
            value: committee_id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  forgotPassword = async (email: string) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "forgotPassword",
        variables: {
          email: {
            value: email,
            type: "String",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  verifyOtp = async (email: string, otp: string) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "verifyOtp",
        variables: {
          email: {
            value: email,
            type: "String",
            required: true,
          },
          otp: {
            value: otp,
            type: "String",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  changePassword = async (
    email: string,
    otp: string,
    password: string,
    confirm_password: string
  ) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "userChangePassword",
        variables: {
          email: {
            value: email,
            type: "String",
            required: true,
          },
          otp: {
            value: otp,
            type: "String",
            required: true,
          },
          password: {
            value: password,
            type: "String",
            required: true,
          },
          confirmPassword: {
            value: confirm_password,
            type: "String",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  getNotMeetingDocumentsManagers = async (
    id: number,
    page = 1,
    limit = 25,
    key = ""
  ) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "get",
      metaData: {
        operation: "notEventDocumentsManagers",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
          key: {
            value: key,
            type: "String",
            required: false,
          },
          page: {
            value: page,
            type: "Int",
            required: false,
          },
          pageSize: {
            value: limit,
            type: "Int",
            required: false,
          },
        },
        fields: [
          "total",
          "page",
          "pages",
          "hasNext",
          "hasPrev",
          {
            results: [
              "id",
              "created",
              "updated",
              "isActive",
              "isAttending",
              "canEdit",
              "canDelete",
              "canManage",
              {
                event: [
                  "id",
                  "title",
                  "canEdit",
                  "canDelete",
                  "canManage",
                  "manageDocuments",
                  "manageAgendas",
                  "manageMinutes",
                ],
              },
              {
                attendee: [
                  "id",
                  "firstName",
                  "middleName",
                  "lastName",
                  "email",
                  "phone",
                  "created",
                  "updated",
                  "isActive",
                  "canEdit",
                  "canDelete",
                  "canManage",
                ],
              },
            ],
          },
        ],
      },
    })
      .catch((error: any) => {
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  addDocumentManager = async (id: number) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "addDocumentManager",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };

  removeDocumentManager = async (id: number) => {
    const data = await gqlDataProvider.custom!({
      url: "",
      method: "post",
      metaData: {
        operation: "removeDocumentManager",
        variables: {
          id: {
            value: id,
            type: "Int",
            required: true,
          },
        },
        fields: ["success", "message"],
      },
    })
      .catch((error: any) => {
        console.log(error);
        return {data: null};
      })
      .then((data: any) => {
        return data;
      });
    return data;
  };
}

export default ApiService;
