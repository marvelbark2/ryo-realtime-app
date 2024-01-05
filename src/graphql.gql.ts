import loki, { Collection } from 'lokijs'


type Friend = {
    name: string;
    username: string;
}

type CollectionFriend = Collection<Friend>

function seedData(collection: CollectionFriend) {
    collection.insert({ name: "Han Solo", username: "a-shot-first-2000" });
    collection.insert({ name: "R2D2", username: "b-robot-master-3000" });
    collection.insert({ name: "Leia", username: "c-rope-swinger-9000" });
    collection.insert({ name: "Yoda", username: "d-little-green-2000" });
    collection.insert({
        name: "Chewbacca",
        username: "e-furry-monster-3000",
    });
    collection.insert({ name: "C-P30", username: "f-robot-villain-9000" });
    collection.insert({ name: "Vadar", username: "g-dark-helmet-2000" });
    collection.insert({ name: "Maul", username: "h-red-guy-3000" });
    collection.insert({ name: "Obiwan", username: "i-hood-man-9000" });
}

function getFriendsByUsername(collection: CollectionFriend, usernameCursor: string, desc = false) {
    return collection
        .chain()
        .simplesort("username", { desc })
        .find({ username: { $gt: usernameCursor } })
        .data();
}


function getFriendsTotalCount(collection: CollectionFriend) {
    return collection.count();
}

function createDatabaseAndCollection() {
    const db = new loki("sandbox.db");

    const friends = db.addCollection<Friend>("friends");

    return friends;
}

const friendsCollection = createDatabaseAndCollection();

seedData(friendsCollection);

//console.debug(getFriendsByUsername(friendsCollection, "b-robot-master-3000"));


const schema = `#graphql
scalar Cursor

enum CacheControlScope {
  PUBLIC
  PRIVATE
}

directive @cacheControl(
  maxAge: Int
  scope: CacheControlScope
  inheritMaxAge: Boolean
) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION


type PageInfo {
  hasNextPage: Boolean!
}

type Friend {
  name: String!
  username: String!
}

type FriendEdge {
  cursor: Cursor!
  node: Friend!
}

type FriendsConnection {
  edges: [FriendEdge!]!
  pageInfo: PageInfo!
}

type LukeSkywalker {
  name: String!
  username: String! @cacheControl(maxAge: 30)
  friendsConnection(first: Int!, after: Cursor): FriendsConnection!
}

type Query {
  lukeSkywalker: LukeSkywalker!
}
`

const resolvers = {
    lukeSkywalker: () => {
        return {
            name: "Luke Skywalker",
            username: "luke-skywalker-1000",
            // Implement the algorithm listed on the Relay specification page
            // <https://relay.dev/graphql/connections.htm#sec-Pagination-algorithm>
            friendsConnection: (args: { first: number, after: string }) => {
                const { first, after } = args;
                if (first < 0) throw new Error("first must be positive");
                // Get the friends using the given cursor
                const friendsByUsername = getFriendsByUsername(
                    friendsCollection,
                    after
                );
                // calculate edges based on the given limit
                const edges = friendsByUsername.slice(0, first);
                // map the data needed for the response
                return {
                    edges: edges.map((friend) => ({
                        cursor: friend.username,
                        node: friend,
                    })),
                    pageInfo: {
                        hasNextPage: friendsByUsername.length > first,
                    },
                };
            },
        };
    },

}

module.exports = { schema, resolvers };