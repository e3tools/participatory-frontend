import { Sync } from 'data-layer/utils/sync';
import {
  TABLES_TO_UP_SYNC,
  TABLES_TO_DOWN_SYNC,
  TABLES_TO_DOWN_SYNC_EXTRA_FIELDS,
  WRITEABLE_TABLES,
} from '../constants/enums';
import { VectorService } from '../services/vector';

const SYNC = new Sync(
  TABLES_TO_UP_SYNC,
  TABLES_TO_DOWN_SYNC,
  TABLES_TO_DOWN_SYNC_EXTRA_FIELDS,
  WRITEABLE_TABLES,
);

const full_sync = async () => {
  await SYNC.full_sync();
  await VectorService._initialize_localDB();
  /*
  SYNC.sync_down(()=>{
    console.log("Sync down completed")
  });
  SYNC.sync_up();*/
};

const down_sync = async () => {
  SYNC.sync_down(() => {
    // load shapes
    VectorService._initialize_localDB();
  });
};
export { full_sync, down_sync };
