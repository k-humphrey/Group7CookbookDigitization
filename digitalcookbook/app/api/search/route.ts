import { connectToDB } from "@/lib/connectToDB";
import Recipe from '../../../models/models/Recipe';
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();
    const recipies = await Recipe.find({});
    return NextResponse.json(recipies);
}

export async function POST(req: Request){
    const body = await req.json();
    await connectToDB;
    const recipe = await Recipe.create(body);
    return NextResponse.json(recipe);
}