// Импортируем необходимые компоненты из библиотеки graphql
const { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString, GraphQLList, GraphQLFloat, GraphQLNonNull } = require('graphql');

// Импортируем нашу модель Cheese
const Cheese = require('../models/cheese');

// Определяем GraphQL тип для нашей модели Cheese
const CheeseType = new GraphQLObjectType({
    name: 'Cheese',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        image: { type: GraphQLString },
        category: { type: GraphQLString }
    })
});

// Определяем корневые запросы (Queries)
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // Получение одного сыра по ID
        cheese: {
            type: CheeseType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parent, args) {
                return Cheese.findByPk(args.id);
            }
        },
        // Получение списка всех сыров
        cheeses: {
            type: new GraphQLList(CheeseType),
            resolve(parent, args) {
                return Cheese.findAll();
            }
        }
    }
});

// Определяем мутации (Mutations)
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Добавление нового сыра
        addCheese: {
            type: CheeseType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLFloat) },
                image: { type: new GraphQLNonNull(GraphQLString) },
                category: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                const cheese = new Cheese({
                    name: args.name,
                    description: args.description,
                    price: args.price,
                    image: args.image,
                    category: args.category
                });
                return cheese.save();
            }
        },
        // Обновление сыра
        updateCheese: {
            type: CheeseType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                price: { type: GraphQLFloat },
                image: { type: GraphQLString },
                category: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const cheese = await Cheese.findByPk(args.id);
                if (!cheese) {
                    throw new Error('Сыр не найден');
                }
                cheese.name = args.name || cheese.name;
                cheese.description = args.description || cheese.description;
                cheese.price = args.price || cheese.price;
                cheese.image = args.image || cheese.image;
                cheese.category = args.category || cheese.category;
                return cheese.save();
            }
        },
        // Удаление сыра
        deleteCheese: {
            type: CheeseType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(parent, args) {
                const cheese = await Cheese.findByPk(args.id);
                if (!cheese) {
                    throw new Error('Сыр не найден');
                }
                await cheese.destroy();
                return cheese;
            }
        }
    }
});

// Экспортируем схему GraphQL
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
