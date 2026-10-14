// export const apiBaseUrl = "http://localhost:7777/api/";
export const apiBaseUrl = "https://danceacademybackend-production.up.railway.app/api/";

export const apiUrls = {
  Auth: {
    addUser: "auth/add-user",
    login: "auth/login",
  },
  Batch: {
    getAll: "batch",
    add: "batch/add-batch",
    update: "batch/update-batch",
    delete: "batch/delete-batch",
  },
  StudentAchievement: {
    getAll: "student-achievement",
    add: "student-achievement/add-achievement",
    update: "student-achievement/update-achievement",
    delete: "student-achievement/delete-achievement",
  },
  OrgAchievement: {
    getAll: "org-achievement",
    add: "org-achievement/add-achievement",
    update: "org-achievement/update-achievement",
    delete: "org-achievement/delete-achievement",
  },
  Gallery: {
    getAll: "gallery",
    add: "gallery/add-gallery",
    update: "gallery/update-gallery",
    delete: "gallery/delete-gallery",
  },
  ImageUpload: {
    uploadImage: "image-upload/uploadImage",
  },
  Enquiry: {
    send: "enquiry",
  },
};
