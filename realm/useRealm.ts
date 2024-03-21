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

    const results = objects.slice(offset, (offset ?? 0) + (limit ?? 0));

    const plainResults = results.map((obj) => Object.assign({}, obj));

    return plainResults;
  } catch (error) {
    console.error('Failed to query the Realm database:', error);
    throw error;
  } finally {
    realm.close();
  }
};

const realmDelete = async (schema: any, filter: string) => {
  const realm = await Realm.open({
    path: 'myrealm',
    schema: [schema],
  });

  try {
    realm.write(() => {
      const objects = realm.objects(schema.name).filtered(filter);
      realm.delete(objects);
    });
  } catch (error) {
    console.error('Failed to delete from the Realm database:', error);
    throw error;
  } finally {
    realm.close();
  }
};

export default {
  realmWrite,
  realmRead,
  realmDelete,
};
