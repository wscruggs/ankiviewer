import { type Route, route, serveDir } from "@std/http";

const routes: Route[] = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/deck/" }),
    handler: () => new Response("get deck"),
    
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/deck/download" }),
    handler: () => new Response("download deck"),
    
  },
  {
    // save update deck (exportDeck)
    method: "PATCH",
    pattern: new URLPattern({ pathname: "/deck" }),
    handler: () => new Response("download deck"),
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/card/:id" }),
    handler: () => new Response("Get card by id"),
  },
  {
    // get all unsaved cards from mongodb
    method: "GET",
    pattern: new URLPattern({ pathname: "/card/new" }),
    handler: () => new Response("Get all newly added unsaved cards"),
  },
  {
    // get a unsaved created card to mongodb
    method: "GET",
    pattern: new URLPattern({ pathname: "/card/new/:id" }),
    handler: () => new Response("get a unsaved card by its id"),
  },
  {
    // Add a new card to the mongodb
    method: "POST",
    pattern: new URLPattern({ pathname: "/card/new" }),
    handler: () => new Response("create a new card"),
  },
  {
    // delete a unsaved card to the mongodb
    method: "DELETE",
    pattern: new URLPattern({ pathname: "/card/delete/:id" }),
    handler: () => new Response("delete a newly created, unsaved card"),
  },
  {
    // Commit a new card from the mongodb into the anki deck.
    method: "PATCH",
    pattern: new URLPattern({ pathname: "/card/new/save" }),
    handler: () => new Response("write all added cards to the deck"),
  },
];

function defaultHandler(_req: Request) {
  return new Response("Not found", { status: 404 });
}

const handler = route(routes, defaultHandler);

export default {
  fetch(req) {
    return handler(req);
  },
} satisfies Deno.ServeDefaultExport;
