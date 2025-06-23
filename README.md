# skycrypt-unflatten

Unflattens the SvelteKit `__data.json` response from SkyCrypt, because the API is inaccessible nowadays.

SkyCrypt’s Svelte endpoint (e.g. `https://sky.shiiyu.moe/stats/USERNAME/PROFILE/__data.json`) returns a heavily “flattened” payload full of integer pointers and shared pools of values. This script reconstructs a normal JSON object with no indirection.

---

## Why? Look at the raw “flattened” data

```json
{
  "type": "data",
  "nodes": [
    { /* nonsense */ },
    null,
    {
      "type": "data",
      "data": [
        {
          "user": 1 
        },
        {
          "displayName": 2, // index 2
          "username": 2,
          "uuid": 3,
          "profile_id": 4,
          "profile_cute_name": 5,
          "selected": 6,
          "rank": 7, // index 7
          "social": 12,
          "items": 14,
          "members": 3931,
          "profiles": 3952,
          "stats": 3959,
          "accessories": 3997,
          "pets": 5362,
          "collections": 7025,
          "skills": 8281,
          "skyblock_level": 8356,
          "mining": 8362,
          "farming": 8935,
          "enchanting": 8986,
          "fishing": 9032,
          "slayer": 9331,
          "dungeons": 9378,
          "minions": 9667,
          "bestiary": 9887,
          "crimson_isle": 10579,
          "rift": 10641,
          "misc": 10699,
          "apiSettings": 11828,
          "errors": 11829
        },
        "TomJuly", // index 2
        "fccff21b9bb84923bd55189c1b1b3f0a",
        "f63c6dcc-a73c-4ce7-b8ee-44168c1e7a72",
        "Lemon",
        true,
        {
          "rankText": 8,
          "rankColor": 9,
          "plusText": 10,
          "plusColor": 11
        },
        "VIP", // index 7
        "#40bb40",
        "+",
        "#d88f07",
        {
          "DISCORD": 13
        },
        "tomjuri",
        "..."
      ]
    }
  ]
}
```

Every field, string, and object lives at a numeric index. It’s a maze of pointers rather than straightforward JSON—and you get the idea!

---

The above json gets translated to the following:

```json
{
  "user": 1,
  "displayName": "TomJuly",
  "username": "TomJuly",
  "uuid": "fccff21b9bb84923bd55189c1b1b3f0a",
  "profile_id": "f63c6dcc-a73c-4ce7-b8ee-44168c1e7a72",
  "profile_cute_name": "Lemon",
  "selected": true,
  "rank": {
    "rankText": "VIP",
    "rankColor": "#40bb40",
    "plusText": "+",
    "plusColor": "#d88f07"
  },
  "social": {
    "DISCORD": "tomjuri"
  }
}
```
