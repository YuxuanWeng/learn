import { RequestResponse } from '@fepkg/request/types';
import { protoRootJSON } from '@fepkg/services/proto';
import { isArrayBuffer } from 'lodash-es';
import { Root, Type, util } from 'protobufjs';

util.toJSONOptions = { longs: String, enums: Number, bytes: String, json: true };

export const protoRoot = Root.fromJSON(protoRootJSON);

export const getResponseTransformer =
  (protobufType: Type, ignoreArrayCheck = false) =>
  <T extends RequestResponse>(response: T) => {
    const passArrayCheck = ignoreArrayCheck || isArrayBuffer(response);
    if (response == null || !passArrayCheck) return response;

    try {
      // @ts-ignore
      const buf = util.newBuffer(response);
      const decodedResponse = protobufType.decode(buf) as unknown as T;
      return decodedResponse;
    } catch (err) {
      return err;
    }
  };
