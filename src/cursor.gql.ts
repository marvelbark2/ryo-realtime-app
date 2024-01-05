
import { Chance } from 'chance';


//@ts-ignore
import { gql } from 'ryo.js/public'

import type GQL from 'graphql'

type GQL = typeof GQL

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLBoolean
} = gql as any as GQL;

import { EventEmitter } from 'events';

class PubSub {
    private eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    publish(eventName: string, data: any) {
        this.eventEmitter.emit(eventName, data);
    }

    asyncIterator(eventName: string): AsyncIterable<any> {
        const eventEmitter = this.eventEmitter;
        const asyncIterator = {
            async next() {
                return new Promise((resolve) => {
                    eventEmitter.once(eventName, (data: any) => {
                        resolve({
                            done: false,
                            value: data
                        });
                    });
                });
            },
            [Symbol.asyncIterator]() {
                return this;
            },
        };
        return asyncIterator

    };
}

type Artwork = {
    id: string,
    title: string,
    year: number,
    artist: string
}

type WithCursor<T> = {
    cursor: string,
    node: T

}



function createDb() {
    const artworks: Artwork[] = [];
    const chance = new Chance();

    for (let i = 1; i < 100; i++) {
        artworks.push({
            id: i.toString(),
            title: chance.sentence({ words: 3 }),
            year: +chance.year({ min: 1900, max: 2018 }),
            artist: chance.name()
        })
    }


    return {
        getArtwork(id: string): Artwork | null {
            return artworks.find(artwork => artwork.id === id) || null;
        },

        addArtwork(artwork: Artwork): Artwork {
            const data = {
                id: (artworks.length + 1).toString(),
                ...artwork
            }
            artworks.push(data);
            return data;
        },

        allArtworksCursor(first: number, cursor: string): WithCursor<Artwork>[] {

            return artworks.filter(artwork => {
                return artwork.id > cursor;
            }).slice(0, first).map(item => {
                return {
                    cursor: Buffer.from("cursor_" + item.id).toString('base64'),
                    node: {
                        id: item.id,
                        year: item.year,
                        title: item.title,
                        artist: item.artist
                    }
                }
            });
        },

        allArtworksCursorCount(cursor: string): any {
            return artworks.filter(artwork => artwork.id > cursor).length;
        },

        decode(encodedId: string): string {
            var decodedID = Buffer.from(encodedId, 'base64').toString('utf-8').split("_")[1];
            return decodedID;
        }
    }
}


const db = createDb();

const pubsub = new PubSub();

const ArtworkType = new GraphQLObjectType({
    name: 'Artwork',
    fields: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        year: { type: GraphQLInt },
        artist: { type: GraphQLString }
    }
})

const PageInfo = new GraphQLObjectType({
    name: 'PageInfo',
    fields: {
        hasNextPage: { type: GraphQLBoolean },
        lastCursor: { type: GraphQLString }
    }
});

const ArtworkEdge = new GraphQLObjectType({
    name: 'ArtworkEdge',
    fields: {
        node: { type: ArtworkType },
        cursor: { type: GraphQLString },
    }
});

const ArtworkConnection = new GraphQLObjectType({
    name: 'ArtworkConnection',
    fields: {
        edges: { type: new GraphQLList(ArtworkEdge) },
        pageInfo: { type: PageInfo }
    }
});

//GraphQL queries definition
const RootQuery = new GraphQLObjectType({
    description: 'Root Query',
    name: 'Query',
    fields: {
        artwork: {
            type: ArtworkType,
            args: {
                id: { type: GraphQLID }
            },
            description: 'Artwork with a specific ID',
            resolve(parentValue, args) {
                return db.getArtwork(args.id);
            }
        },

        artworks: {
            type: ArtworkConnection,
            description: "Connection of Artworks",
            args: {
                first: { type: GraphQLInt },
                after: { type: GraphQLString, defaultValue: "Y3Vyc29yXzE=" }
            },
            resolve(parentValue, args) {
                var artworksCollection;
                //This variable should store how many nodes there are in the edge
                var moreResults;
                var cursor = db.decode(args.after);
                artworksCollection = db.allArtworksCursor(args.first, cursor);

                /* This way to decide if more results are available doesn't work"

                var nodesLeft = db.allArtworksCursorCount(cursor);
            
                if (nodesLeft > args.first) {
                    moreResults = true;
                } else {
                    moreResults = false;
                }
                */

                //The right value for hasNextPage should be stored within moreResult and returned by a count function on the db*/
                var newConnection = {
                    pageInfo: {
                        //hasNextPage: moreResults,
                        hasNextPage: true,
                        lastCursor: args.after
                    },
                    edges: artworksCollection
                }
                return newConnection;
            }
        }
    }
})

const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addArtwork: {
            type: ArtworkType,
            args: {
                title: { type: GraphQLString },
                year: { type: GraphQLInt },
                artist: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                const newArt = db.addArtwork(args);
                pubsub.publish('artworkAdded', { artworkAdded: newArt });
                return newArt;
            }
        }
    }

})


const RootSubscription = new GraphQLObjectType({
    name: 'Subscription',
    fields: {
        artworkAdded: {
            type: ArtworkType,
            subscribe: () => pubsub.asyncIterator('artworkAdded'),
        }
    }

})

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
    subscription: RootSubscription
})


export default {
    schema
}