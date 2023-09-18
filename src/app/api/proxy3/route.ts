import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const image = searchParams.get('image')?.toString();
    const source = searchParams.get('source')?.toString();
    if (!image || !source) {
      return NextResponse.json({ error: 'Image parameter is missing.' });
    }
    const home = process.env.NEXTAUTH_URL || 'http://localhost:3000/'
    const proxy = home+'/api/proxy2'
    try {
      const res = await axios.get(image, {
        headers: {
          referer: source,
        },
      });
      const data = res.data;
      const lines = data.split('\n');
      let output = []
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        const match = lines[i].match(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
        if (match){
            line = `${proxy}?source=${source}&image=${lines[i]}`
        }
        output.push(line)
      }
      const outputData = output.join('\n');
      return new Response(outputData, {
        status: 200,
      });
    } catch (error:any) {
      return NextResponse.json( { error: error.message });
    }
};
