"use server";


import {
    CreateCategorySchema,
    CreateCategorySchemaType,
    DeleteCategorySchema,
    DeleteCategorySchemaType
} from "@/schema/categories";
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import prisma from "@/lib/prisma";

export async function CreateCategory(form: CreateCategorySchemaType) {
    const parsedBody =  CreateCategorySchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Category already exists");
    }

    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const {name, icon, type} = parsedBody.data;
    return await prisma.category.create({
        data: {
            userId: user.id,
            name,
            icon,
            type,
        },
    });
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
    const parsedBody = DeleteCategorySchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Invalid request");
    }

    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    return await prisma.category.delete({
        where: {
            id: parsedBody.data.id,
        },
    });
}
