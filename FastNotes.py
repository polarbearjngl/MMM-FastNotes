import argparse
from backend.fast_notes import start

parser = argparse.ArgumentParser()

parser.add_argument('--host', default=None, type=str, required=True,
                    help='host for app')
parser.add_argument('--port', default=None, type=int, required=True,
                    help="port for app")
parser.add_argument('-d', '--debug', default=False, type=bool,
                    help="run or not debug mode")
args = parser.parse_args()


def main():
    try:
        start(host=args.host, port=args.port, debug=args.debug)
    except (KeyboardInterrupt, SystemExit):
        raise
    except Exception as e:
        raise e


if __name__ == '__main__':
    main()
