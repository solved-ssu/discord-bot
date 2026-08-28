import { InteractionResponseType, InteractionType, verifyKey } from "discord-interactions";

export default {
	async fetch(request, env): Promise<Response> {
		const signature = request.headers.get("X-Signature-Ed25519");
		const timestamp = request.headers.get("X-Signature-Timestamp");
		const body = await request.text();
		const isValid = signature && timestamp && (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
		if (!isValid) return new Response("Wrong signature", { status: 401 });

		const interaction = JSON.parse(body);
		if (interaction.type === InteractionType.PING) {
			return Response.json({ type: InteractionResponseType.PONG });
		}

		if (interaction.type === InteractionType.APPLICATION_COMMAND) {
			return Response.json({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: { content: "퐁!" }
			});
		}

		return new Response("Unknown interaction", { status: 400 });
	},
} satisfies ExportedHandler<Env>;
