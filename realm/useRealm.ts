import Realm from 'realm';

const realmWrite = async (schema: any, data: any) => {
  const realm = await Realm.open({
    path: 'myrealm',
    schema: [schema],
  });

  try {
    realm.write(() => {
      realm.create(schema.name, data, Realm.UpdateMode.Modified);
    });
  } catch (error) {
    console.error('Failed to write to the Realm database:', error);
    throw error;
  } finally {
    console.log('Successfully wrote to the Realm database');
    realm.close();
  }
};

const realmWriteMultiple = async (schema: any, data: any[]) => {
  const realm = await Realm.open({
    path: 'myrealm',
    schema: [schema],
  });

  try {
    realm.write(() => {
      data.forEach((item) => {
        realm.create(schema.name, item, Realm.UpdateMode.Modified);
      });
    });
  } catch (error) {
    console.error('Failed to write to the Realm database:', error);
    throw error;
  } finally {
    console.log(
      `Successfully wrote ${data.length} objects to the Realm database`
    );
    realm.close();
  }
};

const realmRead = async (
  schema: any,
  limit?: number,
  offset?: number,
  sort?: 'ASC' | 'DESC',
  filter?: string
) => {
  const realm = await Realm.open({
    path: 'myrealm',
    schema: [schema],
  });

  try {
    let objects = realm.objects(schema.name);

    if (filter && filter.trim() !== '') {
      objects = objects.filtered(filter);
    }

    if (sort && typeof sort === 'string') {
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';
      objects = objects.sorted(sortField, sortOrder === 'DESC');
    }

    let results;
    if (limit || offset) {
      results = objects.slice(offset, (offset ?? 0) + (limit ?? 0));
    } else {
      results = objects;
    }
    const plainResults = results.map((obj) => Object.assign({}, obj));

    return plainResults;
  } catch (error) {
    console.error('Failed to query the Realm database:', error);
    throw error;
  } finally {
    console.log('Successfully queried the Realm database');
    realm.close();
  }
};

const realmDeleteAll = async (schema: any) => {
  const realm = await Realm.open({
    path: 'myrealm',
    schema: [schema],
  });

  try {
    realm.write(() => {
      const objects = realm.objects(schema.name);
      realm.delete(objects);
    });
  } catch (error) {
    console.error('Failed to delete from the Realm database:', error);
    throw error;
  } finally {
    console.log('Successfully deleted objects from the Realm database');
    realm.close();
  }
};

export default {
  realmWrite,
  realmWriteMultiple,
  realmRead,
  realmDeleteAll,
};
