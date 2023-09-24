import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';

const resolveHandle = async function (lensHandle: string) {
  const result = await fetch(
    `http://localhost:3000/resolveLensHandle?lensHandle=${lensHandle}`,
  );
  return result.json();
};

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'hello':
      const address = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'prompt',
          content: panel([text('Enter the LENS handle to lookup:')]),
        },
      });

      const response = [];

      if (typeof address == 'string') {
        const lensHandle =
          address.slice(-5) === '.lens' ? address : `${address}.lens`;
        const { data } = await resolveHandle(lensHandle);
        if (data) {
          response.push(
            text(`Resolved ETH address for handle ${address}: ${data}`),
          );
        } else {
          response.push(text(`No address was found for ${address}.`));
        }
      } else {
        response.push(text('Please enter a name to lookup!'));
      }
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: panel(response),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};

// export const onRpcRequest: OnRpcRequestHandler = async ({
//   origin,
//   request,
// }) => {
//   switch (request.method) {
//     case 'hello':
//       const handle = await snap.request({
//         method: 'snap_dialog',
//         params: {
//           type: 'prompt',
//           content: panel([
//             text('**Lookup a Lens ID**'),
//             text('Enter the name to lookup:'),
//           ]),
//         },
//       });
//       const response = [];
//       if (typeof handle == 'string') {
//         // const result = await lensLookup(query.trim());

//         // const profile = result.data.profile;

//         const result = await resolveLensHandle(handle.trim());
//         // if (profile && profile.hasOwnProperty('ownedBy')) {
//         if (result) {
//           response.push(text(`**Address found for ${handle}!**`));
//           response.push(text(`Address: ${result}`));
//         } else {
//           response.push(text(`No address was found for ${handle}.`));
//         }
//       } else {
//         response.push(text('Please enter a name to lookup!'));
//       }
//       return snap.request({
//         method: 'snap_dialog',
//         params: {
//           type: 'alert',
//           content: panel(response),
//         },
//       });
//     default:
//       throw new Error('Method not found.');
//   }
// };
