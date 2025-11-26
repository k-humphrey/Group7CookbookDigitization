# Overview of Recipe API Calls Currently available
Backend has created some APIs to fetch and filter recipes from the MongoDB database. So far we have implemented filtering based on:

###### Title (en and es):
```
http://localhost:3000/api/recipes/byTitle?search=<title of recipe>
```
Description: Will return all recipes that include parts of that title
.
.

###### Ingredients (en and es):
```
http://localhost:3000/api/recipes/byIngredient?ingredients=<ingredients comma seperated>
```
Description: Will return all recipes that contain the given ingredients
.
.

###### Tags:
```
http://localhost:3000/api/recipes/byTags?tags=<tags comma seperated>
```
Description: Will return all recipes with true values for the given tags
.
.

###### We have also included an api call to just return all the recipes and there information:
```
http://localhost:3000/api/recipes
```

##### How to use
Plug the URLs into your browser with the server running and they should return the recipe with all information you filtered for.

.
.
.

 **Each API connects to the MongoDB using the connectToDB helper function. Make sure you have set up your env.local before testing locally**
 ___
 
# How to use them in frontend
const recipes = await fetch(`/api/recipes/byTags?tags=blueRibbon`).json();

###### Example of what it returns:
```
[
    {
        "title": {
            "en": "Chicken & Dressing Casserole",
            "es": "Cazuela de Pollo y Aderezo"
        },
        "instructions": {
            "en": "Preheat oven to 350°F. Mix all ingredients together and pour into a greased casserole dish. Cover with aluminum foil. Bake for 45-50 minutes.",
            "es": "Precaliente el horno a 350°F. Mezcle todos los ingredientes y vierta la mezcla en una cazuela engrasada. Cubra con papel aluminio. Hornee durante 45-50 minutos."
        },
        "tags": {
            "blueRibbon": true,
            "vegan": false,
            "vegetarian": false
        },
        "_id": "691fb7a0105e0cd7062fa1e1",
        "imageURI": "",
        "ingredients": [
            {
                "unit": {
                    "en": "Can",
                    "es": "Lata"
                },
                "_id": "69277e643d379d41787ca812",
                "ingredient": {
                    "_id": "691fa00c5320291b22e92aaf",
                    "en": "Chicken",
                    "es": "Pollo",
                    "costPerUnit": null
                },
                "amount": 1
            },
            {
                "unit": {
                    "en": "Can",
                    "es": "Lata"
                },
                "_id": "69277e643d379d41787ca813",
                "ingredient": {
                    "_id": "691fa0565320291b22e92ab4",
                    "en": "Cream of Chicken Soup (low sodium)",
                    "es": "Crema de Pollo (baja en sodio)",
                    "costPerUnit": null
                },
                "amount": 1
            },
            {
                "unit": {
                    "en": "Cup",
                    "es": "Taza"
                },
                "_id": "69277e643d379d41787ca814",
                "ingredient": {
                    "_id": "691fa08b5320291b22e92ab5",
                    "en": "Milk",
                    "es": "Leche",
                    "costPerUnit": null
                },
                "amount": 1
            },
            {
                "_id": "69277e643d379d41787ca815",
                "amount": 1,
                "ingredient": {
                    "_id": "691fa0ae5320291b22e92ab6",
                    "en": "Stuffing Mix",
                    "es": "Mezcla Para Relleno",
                    "costPerUnit": null
                }
            },
            {
                "unit": {
                    "en": "Bag",
                    "es": "Bolsa"
                },
                "_id": "69277e643d379d41787ca816",
                "amount": 1,
                "ingredient": {
                    "_id": "691fa0d85320291b22e92ab7",
                    "en": "Frozen Mixed Vegetables",
                    "es": "Verduras Mixtas Congeladas",
                    "costPerUnit": null
                }
            }
        ],
        "appliances": [
            {
                "_id": "691f9b38c070923666ddc4fe",
                "en": "Oven",
                "es": "Horno"
            }
        ]
    }
]
```