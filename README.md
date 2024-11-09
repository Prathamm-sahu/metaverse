Creating an Internal Package in Turbo Repo  
Ref - https://turbo.build/repo/docs/crafting-your-repository/creating-an-internal-package
1. when you create a new package in packages folder to use it you have to configure 3 things
  a. you have to write exports in package.json
    {
      "exports": {
      "./prismaClient": {
        "types": "./src/index.ts",
        "default": "./dist/index.js"
        }
      }
    },
    
  b. Change the name of package.json. In my case
    {
      "name": "@repo/db"
    }
  c. you have manually write dependency in package.json of the app where you want to use that internal package
    /apps/server/package.json
    {
      "@repo/db": "workspace:*",
    }
  d. In root directory of the project run pnpm install to bring that package to your node_modules
  e. Last step whenever you want to import that package always mention the name of what you have exported after dependency name eg: - "@repo/db/prismaClient"
    eg: - import db from "@repo/db/prismaClient"


  