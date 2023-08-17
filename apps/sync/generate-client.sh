# copy the file from ../db/prisma/schema.prisma to . and overwrite the existing file
cp ../db/prisma/schema.prisma .

# replace the generator client part
awk '/generator client {/{print;getline; print "  provider             = \"prisma-client-py\""; print "  recursive_type_depth = 5"; print "  enable_experimental_decimal = true"; print "  interface            = \"asyncio\""; next}1' schema.prisma > temp.prisma && mv temp.prisma schema.prisma

# generate the client
prisma generate
