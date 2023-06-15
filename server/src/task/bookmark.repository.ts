import { CustomRepository } from "src/typeorm/typeorm-ex.decorator";
import { TreeRepository } from "typeorm";
import { Bookmark } from "src/entity/bookmark.entity";

@CustomRepository(Bookmark)
export class BookmarkRepository extends TreeRepository<Bookmark> {}
