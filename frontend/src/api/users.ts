import {
  userSchema,
  User,
  UserPayload,
  UserProfile,
  UserSkills,
  UpdateUserSkillsPayload,
  userSkillsSchema,
  UserSkill,
  userSkillSchema,
  CreateUserSkillPayload,
} from "@/lib/types";

export async function createUser(userData: UserPayload): Promise<User | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/`, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resJSON = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }
    const validatedUser = userSchema.parse(resJSON);
    return validatedUser;
  } catch (error) {
    console.error("Create User Failed ", error);
    throw new Error();
  }
}

export async function fetchBackendUser(username: string): Promise<User | undefined> {
  try {
    if (!username) {
      throw new Error("Must specify username.");
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${username}/`);
    const resJSON = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }
    const validatedUser = userSchema.parse(resJSON);
    return validatedUser;
  } catch (error) {
    console.error("Fetch Backend User Failed ", error);
    throw new Error();
  }
}

export async function updateUserProfileById(
  id: number,
  userProfileData: Partial<UserProfile>
): Promise<User | undefined> {
  try {
    console.log(userProfileData);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profiles/${id}/`, {
      method: "PUT",
      body: JSON.stringify(userProfileData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resJSON = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }

    const validatedUser = userSchema.parse(resJSON);
    return validatedUser;
  } catch (error) {
    console.error("Update User Profile by id Failed ", error);
    throw new Error();
  }
}

export async function fetchUserSkills(username: string): Promise<UserSkills | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${username}/skills/`);

    const resJSON = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }

    const validatedUserSkills = userSkillsSchema.parse(resJSON);
    return validatedUserSkills;
  } catch (error) {
    console.error("Fetch User Skills Failed ", error);
    throw new Error();
  }
}

export async function fetchUserSkillById(id: number): Promise<UserSkill | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/skills/${id}/`);
    const resJSON = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }

    const validatedUserSkill = userSkillSchema.parse(resJSON);
    return validatedUserSkill;
  } catch (error) {
    console.error(`Failed to get user skill by id: ${id}`, error);
    throw new Error();
  }
}

export async function createUserSkills(userSkillsData: UserSkills): Promise<UserSkills | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/skills/`, {
      method: "POST",
      body: JSON.stringify(userSkillsData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resJSON = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }

    const validatedUserSkills = userSkillsSchema.parse(resJSON);
    return validatedUserSkills;
  } catch (error) {
    console.error("Failed to Create User Skill", error);
    throw new Error();
  }
}

export async function createUserSkill(userSkillData: CreateUserSkillPayload): Promise<UserSkill | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/skills/`, {
      method: "POST",
      body: JSON.stringify(userSkillData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resJSON = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }

    const validatedUserSkill = userSkillSchema.parse(resJSON);
    return validatedUserSkill;
  } catch (error) {
    console.error("Failed to Create User Skill", error);
    throw new Error();
  }
}

export async function updateUserSkill(data: UpdateUserSkillsPayload): Promise<UserSkill | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/skills/sync/`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resJSON = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }

    const validatedUserSkill = userSkillSchema.parse(resJSON);
    return validatedUserSkill;
  } catch (error) {
    console.error("Update User Profile Failed ", error);
    throw new Error();
  }
}

export async function updateUserProfilePic({
  userProfileId,
  file,
}: {
  userProfileId: number;
  file: File;
}): Promise<User | undefined> {
  try {
    const formData = new FormData();
    formData.append("profile_pic", file);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profiles/${userProfileId}/`, {
      method: "PATCH",
      body: formData,
    });

    const resJSON = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(resJSON));
    }

    const validatedUser = userSchema.parse(resJSON);
    return validatedUser;
  } catch (error) {
    console.error("Update User Profile Failed", error);
    throw new Error();
  }
}
