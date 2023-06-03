import { CustomRepository } from "src/typeorm/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { Bookmark } from "src/entity/bookmark.entity";

@CustomRepository(Bookmark)
export class BookmarkRepository extends Repository<Bookmark> {}
